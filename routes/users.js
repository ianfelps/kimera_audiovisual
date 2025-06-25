const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');

// POST /api/usuarios/ (Criar um novo usuário - Cadastro)
router.post('/', async (req, res) => {
    const { nome_completo, nome_usuario, email, senha, id_foto_perfil = 1 } = req.body;

    if (!nome_completo || !nome_usuario || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome_completo, nome_usuario, email, senha.' });
    }

    try {
        const senha_hash = await bcrypt.hash(senha, 10); // Gera o hash da senha
        const sql = 'INSERT INTO Usuarios (nome_completo, nome_usuario, email, senha_hash, id_foto_perfil) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [nome_completo, nome_usuario, email, senha_hash, id_foto_perfil]);
        
        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.insertId });
    } catch (error) {
        // Trata erro de e-mail/usuário duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Nome de usuário ou e-mail já existem.' });
        }
        res.status(500).json({ error: 'Erro no servidor ao criar usuário.', details: error.message });
    }
});

// GET /api/usuarios/:nome_usuario (Buscar um usuário pelo nome de usuário)
router.get('/:nome_usuario', async (req, res) => {
    const { nome_usuario } = req.params;
    try {
        const sql = `
            SELECT u.id_usuario, u.nome_completo, u.nome_usuario, u.biografia, u.data_criacao, p.url_foto 
            FROM Usuarios u 
            LEFT JOIN Fotos_Perfil p ON u.id_foto_perfil = p.id_foto 
            WHERE u.nome_usuario = ?`;
        
        const [[user]] = await db.query(sql, [nome_usuario]); // [[user]] pega o primeiro elemento do array de resultados
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
});

// POST /api/usuarios/login (Autenticar um usuário)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const sql = 'SELECT id_usuario, email, senha_hash FROM Usuarios WHERE email = ?';
        const [[user]] = await db.query(sql, [email]);

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' }); // Usuário não encontrado
        }

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);

        if (senhaValida) {
            // IMPORTANTE: Em uma aplicação real, aqui você geraria e retornaria um token JWT.
            res.status(200).json({ message: 'Login bem-sucedido!', userId: user.id_usuario, token: 'token_jwt_placeholder' });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas.' }); // Senha incorreta
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor durante o login.', details: error.message });
    }
});

module.exports = router;