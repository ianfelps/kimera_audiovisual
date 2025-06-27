document.addEventListener('DOMContentLoaded', () => {
    // --- AUTENTICAÇÃO E INICIALIZAÇÃO ---
    const token = localStorage.getItem('authToken');
    const loggedInUserId = localStorage.getItem('userId');

    if (!token || !loggedInUserId) {
        window.location.href = 'login.html';
        return;
    }

    const feedContainer = document.getElementById('feed-container');
    const createPostForm = document.getElementById('create-post-form');
    const postTextarea = document.getElementById('post-textarea');
    const userAvatarPostbox = document.getElementById('user-avatar-postbox');

    // --- FUNÇÕES ---

    async function fetchAndRenderFeed() {
        feedContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border" role="status"></div></div>';
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) throw new Error('Falha ao carregar o feed.');
            const posts = await response.json();
            feedContainer.innerHTML = '';
            if (posts.length === 0) {
                feedContainer.innerHTML = '<p class="text-center">Ainda não há publicações. Crie o primeiro post!</p>';
            } else {
                posts.forEach(post => {
                    const postElement = createPostElement(post);
                    feedContainer.appendChild(postElement);
                });
            }
        } catch (error) {
            console.error(error);
            feedContainer.innerHTML = '<p class="text-center text-danger">Não foi possível carregar o feed.</p>';
        }
    }

    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'shadow-lg rounded my-5';
        postDiv.id = `post-${post.id_post}`;

        const isOwnPost = post.id_usuario_autor === parseInt(loggedInUserId, 10);
        
        const profileImageUrl = post.url_foto || 'img/default-profile.png';
        const postDate = new Date(post.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

        postDiv.innerHTML = `
            <div class="row g-0">
                <div class="col-12 col-lg-1 d-flex justify-content-center align-items-start pt-4">
                    <img src="${profileImageUrl}" alt="Foto de ${post.nome_usuario}" class="rounded-circle border shadow-sm" width="85" height="85" style="object-fit: cover;">
                </div>
                <div class="col-12 col-lg-11 px-4 py-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="h5">${post.nome_completo}</span>
                            <span class="text-muted">@${post.nome_usuario} · ${postDate}</span>
                        </div>
                        ${isOwnPost ? `
                        <div class="dropdown">
                            <button class="btn btn-link text-light py-0 px-2" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots-vertical h5"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item text-danger" href="#" data-action="delete-post" data-post-id="${post.id_post}">Excluir Post</a></li>
                            </ul>
                        </div>` : ''}
                    </div>
                    <p class="mt-2 lead">${post.conteudo_texto}</p>
                    <hr>
                    <div class="d-flex justify-content-start align-items-center">
                        <button class="btn btn-link text-light me-3" data-action="like-post" data-post-id="${post.id_post}"><i class="bi bi-heart"></i> <span data-role="like-count">0</span></button>
                        <button class="btn btn-link text-light" data-action="comment" data-post-id="${post.id_post}"><i class="bi bi-chat-dots"></i> <span data-role="comment-count">0</span></button>
                    </div>
                </div>
            </div>
        `;
        return postDiv;
    }

    async function handlePostSubmit(event) {
        event.preventDefault();
        const content = postTextarea.value.trim();
        if (!content) return;
        const postData = {
            conteudo_texto: content,
            id_usuario_autor: loggedInUserId
        };
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (!response.ok) throw new Error('Falha ao criar o post.');
            postTextarea.value = '';
            fetchAndRenderFeed();
        } catch (error) {
            console.error(error);
            alert('Não foi possível publicar seu post.');
        }
    }
    
    // --- FUNÇÃO DE INTERAÇÃO CORRIGIDA ---
    async function handleFeedInteraction(event) {
        const target = event.target.closest('[data-action]');
        if (!target) return;
        const action = target.dataset.action;
        const postId = target.dataset.postId;

        if (action === 'delete-post') {
            if (confirm('Tem certeza que deseja excluir este post?')) {
                try {
                    // A requisição de deleção segura.
                    const response = await fetch(`/api/posts/${postId}`, {
                        method: 'DELETE',
                        headers: {
                            // 1. Não precisa mais de 'Content-Type' nem de 'body'.
                            // 2. A linha mais importante: envia o token para autenticação.
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Falha ao deletar.');
                    }
                    
                    document.getElementById(`post-${postId}`).remove();
                } catch (error) {
                    console.error('Erro ao excluir post:', error);
                    alert(`Não foi possível excluir o post. Motivo: ${error.message}`);
                }
            }
        }
    }

    // --- EVENT LISTENERS E INICIALIZAÇÃO ---
    createPostForm.addEventListener('submit', handlePostSubmit);
    feedContainer.addEventListener('click', handleFeedInteraction);
    
    fetch(`/api/usuarios/me`, { headers: {'Authorization': `Bearer ${token}`}})
        .then(res => res.ok ? res.json() : null)
        .then(user => {
            if (user && user.url_foto) {
                userAvatarPostbox.src = user.url_foto;
            }
        }).catch(console.error);
    
    fetchAndRenderFeed();
});