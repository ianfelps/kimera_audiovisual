document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('authToken')) {
        window.location.href = '/index.html'; // ou '/dashboard.html'
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Previne o recarregamento da página

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // Limpa mensagens de erro anteriores
            if (messageDiv) {
                messageDiv.textContent = '';
            }

            const loginData = {
                email,
                senha
            };

            try {
                // Endpoint correto da sua API
                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                const data = await response.json();

                if (response.ok) {
                    // Login bem-sucedido!
                    console.log('Login bem-sucedido:', data);

                    // **Ação Principal: Armazenar o token no localStorage**
                    // O localStorage mantém o token salvo mesmo após fechar o navegador.
                    localStorage.setItem('authToken', data.token);

                    // Opcional: Salvar também o ID do usuário se for útil
                    localStorage.setItem('userId', data.userId);

                    messageDiv.className = 'alert alert-success';
                    messageDiv.textContent = 'Login realizado com sucesso! Redirecionando...';
                    setTimeout(() => {
                        window.location.href = 'index.html'; // Redireciona para o login
                    }, 2000);

                } else {
                    // Exibe a mensagem de erro retornada pela API
                    if (messageDiv) {
                        messageDiv.className = 'alert alert-danger';
                        messageDiv.textContent = data.error || 'Credenciais inválidas.';
                    }
                }
            } catch (error) {
                // Erro de rede ou falha na comunicação com a API
                console.error('Erro ao tentar fazer login:', error);
                if (messageDiv) {
                    messageDiv.className = 'alert alert-danger';
                    messageDiv.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
                }
            }
        });
    }
});