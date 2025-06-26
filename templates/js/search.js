document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'login.html'; 
        return; 
    }

    const searchForm = document.getElementById('search-form');
    const usernameInput = document.getElementById('username-input');
    const resultsContainer = document.getElementById('search-results-container');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const usernameToSearch = usernameInput.value.trim();
        if (!usernameToSearch) return; 

        resultsContainer.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';

        try {
            const response = await fetch(`/api/usuarios/${usernameToSearch}`);
            
            if (response.ok) {
                const user = await response.json();
                renderUserProfile(user);
            } else if (response.status === 404) {
                renderErrorMessage('Usuário não encontrado.');
            } else {
                const errorData = await response.json();
                renderErrorMessage(errorData.error || 'Ocorreu um erro ao buscar o usuário.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            renderErrorMessage('Falha na comunicação com o servidor. Tente novamente mais tarde.');
        }
    });

    function renderUserProfile(user) {
        const profileImageUrl = user.url_foto || 'img/icons/ico01.png'; 

        const userCardHTML = `
            <div class="col-md-8">
                <div class="card shadow-lg">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4 text-center">
                                <img src="${profileImageUrl}" alt="Foto de Perfil de ${user.nome_usuario}" class="img-fluid rounded-circle mb-3 shadow" style="width: 150px; height: 150px; object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <h3 class="card-title">${user.nome_completo}</h3>
                                <h5 class="text-muted">@${user.nome_usuario}</h5>
                                <p class="card-text mt-3">${user.biografia || '<i>Este usuário ainda não adicionou uma biografia.</i>'}</p>
                                <hr>
                                <p class="card-text"><small class="text-muted">Membro desde: ${new Date(user.data_criacao).toLocaleDateString('pt-BR')}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.innerHTML = userCardHTML;
    }

    function renderErrorMessage(message) {
        resultsContainer.innerHTML = `<div class="col-12 text-center alert alert-light">${message}</div>`;
    }
});