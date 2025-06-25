document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos da navbar que precisam ser gerenciados
    const navRede = document.getElementById('nav-rede');
    const navBuscar = document.getElementById('nav-buscar');
    const navPerfil = document.getElementById('nav-perfil');
    const navLogin = document.getElementById('nav-login');
    const navRegistro = document.getElementById('nav-registro');
    const navLogout = document.getElementById('nav-logout');
    const logoutButton = document.getElementById('logout-button');

    // Pega o token de autenticação do localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
        // --- USUÁRIO ESTÁ LOGADO ---
        // Mostra os itens de navegação para usuários autenticados
        navRede.style.display = 'block';
        navBuscar.style.display = 'block';
        navPerfil.style.display = 'block';
        navLogout.style.display = 'block';

        // Esconde os itens de login e registro
        navLogin.style.display = 'none';
        navRegistro.style.display = 'none';

    } else {
        // --- USUÁRIO NÃO ESTÁ LOGADO ---
        // Mostra apenas os botões de login e registro
        navLogin.style.display = 'block';
        navRegistro.style.display = 'block';

        // Esconde o restante
        navRede.style.display = 'none';
        navBuscar.style.display = 'none';
        navPerfil.style.display = 'none';
        navLogout.style.display = 'none';
    }

    // Adiciona a funcionalidade de logout ao botão
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Previne que o link '#' recarregue a página

            // Limpa o token e qualquer outra informação do usuário
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');

            // Redireciona para a página de login
            window.location.href = 'login.html';
        });
    }
});