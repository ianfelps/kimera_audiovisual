document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        window.location.href = 'login.html'; 
        return;
    }

    const profileContainer = document.getElementById('profile-container');
    
    profileContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

    try {
        const response = await fetch('/api/usuarios/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            localStorage.clear(); 
            window.location.href = 'login.html'; 
            return;
        }

        const user = await response.json();
        renderUserProfile(user);
    } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        profileContainer.innerHTML = '<div class="alert alert-danger">Não foi possível carregar o perfil. Tente novamente mais tarde.</div>';
    }
});

function renderUserProfile(user) {
    const profileContainer = document.getElementById('profile-container');
    const profileImageUrl = user.url_foto || 'img/icons/ico01.png';

    const profileHTML = `
        <div class="row g-0">
            <div class="col-12 col-lg-2 d-flex justify-content-center align-items-center p-3">
                <img src="${profileImageUrl}" alt="Foto de perfil de ${user.nome_usuario}" width="150" height="150" class="rounded-circle border shadow" style="object-fit: cover;">
            </div>
            <div class="col-12 col-lg-10 px-4 py-4">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h4>${user.nome_completo}</h4>
                        <h5 class="text-secondary">@${user.nome_usuario}</h5>
                    </div>
                    <div>
                        <a href="edit-profile.html" class="btn btn-outline-light">
                            <i class="bi bi-pencil-square"></i> &nbsp;Editar Perfil
                        </a>
                        <button id="profile-logout-button" class="btn btn-outline-danger ms-3">
                            <i class="bi bi-x-lg"></i> &nbsp;Sair
                        </button>
                    </div>
                </div>
                <div class="d-flex flex-row mt-2">
                    <div class="pe-3">
                        <a href="#" class="text-decoration-none text-light"><strong>???</strong> publicações</a>
                    </div>
                    <div class="px-3 border-start border-end">
                        <a href="#" class="text-decoration-none text-light"><strong>???</strong> seguidores</a>
                    </div>
                    <div class="ps-3">
                        <a href="#" class="text-decoration-none text-light"><strong>???</strong> seguidos</a>
                    </div>
                </div>
                <p class="lead mt-3">${user.biografia || '<i>Clique em "Editar Perfil" para adicionar uma biografia.</i>'}</p>
            </div>
        </div>
    `;
    
    profileContainer.innerHTML = profileHTML;

    const logoutButton = document.getElementById('profile-logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Limpa o token e qualquer outra informação do usuário do localStorage
            localStorage.clear();
            // Redireciona para a página de login
            window.location.href = 'index.html';
        });
    }
}

// Futuramente, você pode criar esta função para buscar os posts
// async function fetchAndRenderPosts(userId) { ... }