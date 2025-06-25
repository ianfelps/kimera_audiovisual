// Aguarda o conteúdo da página (DOM) ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('authToken')) {
        window.location.href = '/index.html'; 
        return; 
    }

    // 2. LÓGICA DE CADASTRO
    const registerForm = document.getElementById('register-form');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Captura os dados do formulário
            const nome_completo = document.getElementById('nome').value;
            const nome_usuario = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // Limpa mensagens anteriores
            messageDiv.textContent = '';
            messageDiv.className = 'message';

            const userData = {
                nome_completo,
                nome_usuario,
                email,
                senha,
                id_foto_perfil: 1 
            };

            try {
                const response = await fetch('/api/usuarios/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.className = 'alert alert-success';
                    messageDiv.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    messageDiv.className = 'alert alert-danger';
                    messageDiv.textContent = data.error || 'Não foi possível realizar o cadastro.';
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                messageDiv.className = 'alert alert-danger';
                messageDiv.textContent = 'Falha na comunicação com o servidor. Tente novamente mais tarde.';
            }
        });
    }
});