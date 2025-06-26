document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('authToken')) {
        window.location.href = '/index.html';
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            if (messageDiv) {
                messageDiv.textContent = '';
            }

            const loginData = {
                email,
                senha
            };

            try {
                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Login bem-sucedido:', data);

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userId', data.userId);

                    messageDiv.className = 'alert alert-success';
                    messageDiv.textContent = 'Login realizado com sucesso! Redirecionando...';
                    setTimeout(() => {
                        window.location.href = 'index.html'; 
                    }, 2000);

                } else {
                    if (messageDiv) {
                        messageDiv.className = 'alert alert-danger';
                        messageDiv.textContent = data.error || 'Credenciais inválidas.';
                    }
                }
            } catch (error) {
                console.error('Erro ao tentar fazer login:', error);
                if (messageDiv) {
                    messageDiv.className = 'alert alert-danger';
                    messageDiv.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
                }
            }
        });
    }
});