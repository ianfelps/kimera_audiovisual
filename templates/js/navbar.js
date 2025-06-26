document.addEventListener('DOMContentLoaded', () => {
    const navRede = document.getElementById('nav-rede');
    const navBuscar = document.getElementById('nav-buscar');
    const navPerfil = document.getElementById('nav-perfil');
    const navLogin = document.getElementById('nav-login');
    const navRegistro = document.getElementById('nav-registro');
    const navLogout = document.getElementById('nav-logout');
    const logoutButton = document.getElementById('logout-button');

    const token = localStorage.getItem('authToken');

    if (token) {
        // --- USUÁRIO ESTÁ LOGADO ---
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

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); 

            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');

            window.location.href = 'login.html';
        });
    }
});