document.addEventListener('DOMContentLoaded', async () => {
    // --- VERIFICAÇÃO DE LOGIN ---
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // --- SELETORES DE ELEMENTOS DO FORMULÁRIO ---
    const form = document.getElementById('edit-profile-form');
    const messageDiv = document.getElementById('form-message');
    const nomeCompletoInput = document.getElementById('nome_completo');
    const nomeUsuarioInput = document.getElementById('nome_usuario');
    const biografiaInput = document.getElementById('biografia');
    const fotoIdInput = document.getElementById('id_foto_perfil');

    // --- 1. BUSCAR E PREENCHER DADOS ATUAIS ---
    try {
        messageDiv.innerHTML = '<div class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div> Carregando seus dados...</div>';

        const response = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar os dados do perfil.');
        }

        const user = await response.json();

        // Preenche o formulário com os dados recebidos da API
        nomeCompletoInput.value = user.nome_completo || '';
        nomeUsuarioInput.value = user.nome_usuario || '';
        biografiaInput.value = user.biografia || '';
        fotoIdInput.value = user.id_foto_perfil || 1;
        
        messageDiv.innerHTML = ''; // Limpa a mensagem de "carregando"

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        messageDiv.innerHTML = '<div class="alert alert-danger">Não foi possível carregar seus dados para edição.</div>';
    }


    // --- 2. LIDAR COM O ENVIO DO FORMULÁRIO ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageDiv.innerHTML = ''; // Limpa mensagens antigas

        // Coleta os dados atualizados do formulário
        const updatedData = {
            nome_completo: nomeCompletoInput.value,
            nome_usuario: nomeUsuarioInput.value,
            biografia: biografiaInput.value,
            id_foto_perfil: parseInt(fotoIdInput.value, 10) || 1,
        };

        try {
            const response = await fetch('/api/users/editar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.innerHTML = '<div class="alert alert-success">Perfil atualizado com sucesso! Redirecionando...</div>';
                // Redireciona para a página de perfil após 2 segundos para ver as mudanças
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
            } else {
                // Exibe o erro específico da API (ex: "nome de usuário já em uso")
                messageDiv.innerHTML = `<div class="alert alert-danger">${result.error || 'Ocorreu um erro ao atualizar.'}</div>`;
            }

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            messageDiv.innerHTML = '<div class="alert alert-danger">Falha na comunicação com o servidor.</div>';
        }
    });
});