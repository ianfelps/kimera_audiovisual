document.addEventListener('DOMContentLoaded', () => {
    // --- AUTENTICAÇÃO E INICIALIZAÇÃO ---
    const token = localStorage.getItem('token');
    const loggedInUserId = parseInt(localStorage.getItem('userId'), 10);

    if (!token) {
        window.location.href = 'login.html'; 
        return; 
    }

    const searchForm = document.getElementById('search-form');
    const usernameInput = document.getElementById('username-input');
    const resultsContainer = document.getElementById('search-results-container');

    // --- LÓGICA DE BUSCA ---
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const usernameToSearch = usernameInput.value.trim();
        if (!usernameToSearch) return; 

        resultsContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-light" role="status"></div></div>';

        try {
            // A requisição para a sua API, que já funciona
            const response = await fetch(`/api/users/${usernameToSearch}`, {
                headers: {
                    // Importante: a rota precisa saber quem está logado para verificar o status de 'seguir'
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                renderUserProfile(user);
            } else {
                renderErrorMessage('Usuário não encontrado.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            renderErrorMessage('Falha na comunicação com o servidor.');
        }
    });

    // --- RENDERIZAÇÃO E INTERAÇÃO ---

    /**
     * Renderiza o card do perfil do usuário na tela.
     * @param {object} user - O objeto do usuário retornado pela API.
     */
    function renderUserProfile(user) {
        const profileImageUrl = user.url_foto || 'img/icons/ico01.png'; 
        const isMyOwnProfile = user.id_usuario === loggedInUserId;

        // --- LÓGICA CENTRAL DO BOTÃO ---
        // O Javascript verifica se a API retornou o campo 'ja_seguindo' como verdadeiro.
        const followButtonText = user.ja_seguindo ? 'Seguindo' : 'Seguir';
        const followButtonClass = user.ja_seguindo ? 'btn-primary' : 'btn-outline-primary';

        const userCardHTML = `
            <div class="col-md-8">
                <div class="card shadow-lg">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4 text-center">
                                <img src="${profileImageUrl}" alt="Foto de Perfil de ${user.nome_usuario}" class="img-fluid rounded-circle mb-3 shadow" style="width: 150px; height: 150px; object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h3 class="card-title mb-0">${user.nome_completo}</h3>
                                    ${!isMyOwnProfile ? `
                                    <button class="btn ${followButtonClass}" data-action="toggle-follow" data-user-id="${user.id_usuario}">
                                        ${followButtonText}
                                    </button>
                                    ` : ''}
                                </div>
                                <h5 class="text-muted">@${user.nome_usuario}</h5>
                                <p class="card-text mt-3">${user.biografia || '<i>Este usuário ainda não adicionou uma biografia.</i>'}</p>
                                <hr>
                                <div class="d-flex justify-content-start">
                                    <div class="me-4"><strong>${user.followers_count || 0}</strong> Seguidores</div>
                                    <div><strong>${user.following_count || 0}</strong> Seguindo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.innerHTML = userCardHTML;
    }

    /**
     * Lida com cliques em botões de ação, como "seguir".
     */
    async function handleInteraction(event) {
        const target = event.target.closest('[data-action="toggle-follow"]');
        if (!target) return;

        const userIdToFollow = target.dataset.userId;

        try {
            const response = await fetch(`/api/interactions/users/${userIdToFollow}/seguir`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Não foi possível completar a ação.');

            // Atualiza o botão visualmente com base na resposta da API
            if (result.seguiu) {
                target.textContent = 'Seguindo';
                target.classList.remove('btn-outline-primary');
                target.classList.add('btn-primary');
                
                // Atualiza contador de seguidores (+1)
                updateFollowersCount(1);
            } else {
                target.textContent = 'Seguir';
                target.classList.remove('btn-primary');
                target.classList.add('btn-outline-primary');
                
                // Atualiza contador de seguidores (-1)
                updateFollowersCount(-1);
            }
        } catch (error) {
            console.error('Erro ao seguir/deixar de seguir:', error);
            alert(error.message);
        }
    }

    function updateFollowersCount(change) {
        const followersElement = document.querySelector('.d-flex.justify-content-start .me-4 strong');
        if (followersElement) {
            const currentCount = parseInt(followersElement.textContent) || 0;
            const newCount = Math.max(0, currentCount + change);
            followersElement.textContent = newCount;
        }
    }

    function renderErrorMessage(message) {
        resultsContainer.innerHTML = `<div class="col-12 text-center alert alert-light">${message}</div>`;
    }

    resultsContainer.addEventListener('click', handleInteraction);
});