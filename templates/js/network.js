document.addEventListener('DOMContentLoaded', () => {
    // --- AUTENTICAÇÃO E INICIALIZAÇÃO ---
    const token = localStorage.getItem('token');
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
            const response = await fetch('/api/posts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
        const isFollowing = post.is_following;
        const hasLiked = post.has_liked;
        
        const profileImageUrl = post.url_foto || 'img/icons/ico01.png';
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
                            ${!isOwnPost ? `
                            <button class="btn btn-sm btn-outline-${isFollowing ? 'secondary' : 'primary'} ms-2" 
                                    data-action="toggle-follow" 
                                    data-user-id="${post.id_usuario_autor}">
                                ${isFollowing ? 'Desseguir' : 'Seguir'}
                            </button>` : ''}
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
                        <button class="btn btn-link text-light me-3" data-action="toggle-like" data-post-id="${post.id_post}">
                            <i class="bi bi-heart${hasLiked ? '-fill text-danger' : ''}"></i> 
                            <span data-role="like-count">${post.likes_count || 0}</span>
                        </button>
                        <button class="btn btn-link text-light me-3" data-action="toggle-comments" data-post-id="${post.id_post}">
                            <i class="bi bi-chat-dots"></i> 
                            <span data-role="comment-count">${post.comments_count || 0}</span>
                        </button>
                    </div>
                    <div class="comments-section" id="comments-${post.id_post}" style="display: none;">
                        <hr>
                        <div class="add-comment-form mb-3">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Adicione um comentário..." data-comment-input="${post.id_post}">
                                <button class="btn btn-primary" data-action="add-comment" data-post-id="${post.id_post}">Enviar</button>
                            </div>
                        </div>
                        <div class="comments-list" id="comments-list-${post.id_post}">
                            <!-- Comentários serão carregados aqui -->
                        </div>
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
        
        const postData = { conteudo_texto: content };
        
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
    
    // --- FUNÇÃO DE INTERAÇÃO COMPLETA ---
    async function handleFeedInteraction(event) {
        const target = event.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        const postId = target.dataset.postId;
        const userId = target.dataset.userId;

        try {
            switch (action) {
                case 'delete-post':
                    await handleDeletePost(postId);
                    break;
                case 'toggle-like':
                    await handleToggleLike(postId, target);
                    break;
                case 'toggle-comments':
                    await handleToggleComments(postId);
                    break;
                case 'add-comment':
                    await handleAddComment(postId);
                    break;
                case 'toggle-follow':
                    await handleToggleFollow(userId, target);
                    break;
                case 'delete-comment':
                    await handleDeleteComment(target.dataset.commentId, postId);
                    break;
            }
        } catch (error) {
            console.error('Erro na interação:', error);
            alert('Erro ao executar ação. Tente novamente.');
        }
    }

    async function handleDeletePost(postId) {
        if (!confirm('Tem certeza que deseja excluir este post?')) return;
        
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha ao deletar.');
        }
        
        // Reload da página após deletar
        location.reload();
    }

    async function handleToggleLike(postId, button) {
        const response = await fetch(`/api/interactions/posts/${postId}/curtir`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Falha ao curtir/descurtir');
        
        const data = await response.json();
        const icon = button.querySelector('i');
        const countSpan = button.querySelector('[data-role="like-count"]');
        
        // Atualiza o ícone
        if (data.curtiu) {
            icon.className = 'bi bi-heart-fill text-danger';
        } else {
            icon.className = 'bi bi-heart';
        }
        
        // Atualiza a contagem
        countSpan.textContent = data.likes_count;
    }

    async function handleToggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        
        if (commentsSection.style.display === 'none') {
            // Mostrar comentários
            commentsSection.style.display = 'block';
            await loadComments(postId);
        } else {
            // Esconder comentários
            commentsSection.style.display = 'none';
        }
    }

    async function loadComments(postId) {
        const commentsList = document.getElementById(`comments-list-${postId}`);
        commentsList.innerHTML = '<div class="text-center"><div class="spinner-border spinner-border-sm"></div></div>';
        
        try {
            const response = await fetch(`/api/interactions/posts/${postId}/comentarios`);
            if (!response.ok) throw new Error('Falha ao carregar comentários');
            
            const comments = await response.json();
            commentsList.innerHTML = '';
            
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item mb-2 p-2 border rounded';
                commentDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="d-flex">
                            <img src="${comment.url_foto || 'img/icons/ico01.png'}" 
                                 class="rounded-circle me-2" width="30" height="30">
                            <div>
                                <strong>${comment.nome_usuario}</strong>
                                <p class="mb-0">${comment.texto_comentario}</p>
                                <small class="text-muted">${new Date(comment.data_comentario).toLocaleString('pt-BR')}</small>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" 
                                data-action="delete-comment" 
                                data-comment-id="${comment.id_comentario}"
                                data-post-id="${postId}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                commentsList.appendChild(commentDiv);
            });
        } catch (error) {
            commentsList.innerHTML = '<p class="text-danger">Erro ao carregar comentários</p>';
        }
    }

    async function handleAddComment(postId) {
        const input = document.querySelector(`[data-comment-input="${postId}"]`);
        const text = input.value.trim();
        
        if (!text) return;
        
        const response = await fetch(`/api/interactions/posts/${postId}/comentar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ texto_comentario: text })
        });

        if (!response.ok) throw new Error('Falha ao adicionar comentário');
        
        const data = await response.json();
        input.value = '';
        
        // Atualiza contador de comentários
        const countSpan = document.querySelector(`[data-post-id="${postId}"][data-action="toggle-comments"] [data-role="comment-count"]`);
        countSpan.textContent = data.comments_count;
        
        // Recarrega os comentários
        await loadComments(postId);
    }

    async function handleToggleFollow(userId, button) {
        const response = await fetch(`/api/interactions/users/${userId}/seguir`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Falha ao seguir/desseguir');
        
        const data = await response.json();
        
        // Atualiza TODOS os botões de seguir/desseguir dessa pessoa no feed
        const allFollowButtons = document.querySelectorAll(`[data-action="toggle-follow"][data-user-id="${userId}"]`);
        
        allFollowButtons.forEach(btn => {
            if (data.seguiu) {
                btn.textContent = 'Desseguir';
                btn.className = 'btn btn-sm btn-outline-secondary ms-2';
            } else {
                btn.textContent = 'Seguir';
                btn.className = 'btn btn-sm btn-outline-primary ms-2';
            }
        });
    }

    async function handleDeleteComment(commentId, postId) {
        if (!confirm('Tem certeza que deseja deletar este comentário?')) return;
        
        const response = await fetch(`/api/interactions/comentarios/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Falha ao deletar comentário');
        
        // Recarrega os comentários
        await loadComments(postId);
        
        // Atualiza contador (decrementa)
        const countSpan = document.querySelector(`[data-post-id="${postId}"][data-action="toggle-comments"] [data-role="comment-count"]`);
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = Math.max(0, currentCount - 1);
    }

    // --- EVENT LISTENERS E INICIALIZAÇÃO ---
    createPostForm.addEventListener('submit', handlePostSubmit);
    feedContainer.addEventListener('click', handleFeedInteraction);
    
    fetch(`/api/users/me`, { headers: {'Authorization': `Bearer ${token}`}})
        .then(res => res.ok ? res.json() : null)
        .then(user => {
            if (user && user.url_foto) {
                userAvatarPostbox.src = user.url_foto;
            }
        }).catch(console.error);
    
    fetchAndRenderFeed();
});