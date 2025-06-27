const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

// Configura o JWT
const JWT_SECRET = process.env.JWT_SECRET;

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

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const sql = 'SELECT id_usuario, nome_usuario, email, senha_hash FROM Usuarios WHERE email = ?';
        const [[user]] = await db.query(sql, [email]);

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);

        if (senhaValida) {
            const payload = {
                userId: user.id_usuario,
                username: user.nome_usuario,
                email: user.email
            };

            // Gera o token JWT
            const token = jwt.sign(
                payload,    
                JWT_SECRET,   
                { expiresIn: '1h' } 
            );

            res.status(200).json({ 
                message: 'Login bem-sucedido!', 
                userId: user.id_usuario,
                token: token 
            });

        } else {
            res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor durante o login.', details: error.message });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        // --- QUERY ATUALIZADA ---
        const sql = `
            SELECT 
                u.id_usuario, u.nome_completo, u.nome_usuario, u.biografia, u.data_criacao, p.url_foto,
                (SELECT COUNT(*) FROM Seguidores WHERE id_seguindo = u.id_usuario) AS total_seguidores,
                (SELECT COUNT(*) FROM Seguidores WHERE id_seguidor = u.id_usuario) AS total_seguindo
            FROM Usuarios u 
            LEFT JOIN Fotos_Perfil p ON u.id_foto_perfil = p.id_foto 
            WHERE u.id_usuario = ?`;
        
        const [[user]] = await db.query(sql, [userId]);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao buscar perfil.', details: error.message });
    }
});

router.put('/editar', auth, async (req, res) => { // <-- 2. Usa o middleware aqui
    
    // 3. O ID do usuário vem do token, garantindo que ele só possa editar o próprio perfil.
    const userId = req.user.userId; 

    // 4. Pega os dados que o usuário quer atualizar do corpo da requisição.
    const { nome_completo, nome_usuario, biografia, id_foto_perfil } = req.body;

    // 5. Monta a query de forma dinâmica para atualizar apenas os campos fornecidos.
    const fields = [];
    const values = [];

    if (nome_completo) {
        fields.push('nome_completo = ?');
        values.push(nome_completo);
    }
    if (nome_usuario) {
        fields.push('nome_usuario = ?');
        values.push(nome_usuario);
    }
    if (biografia) {
        fields.push('biografia = ?');
        values.push(biografia);
    }
    if (id_foto_perfil) {
        fields.push('id_foto_perfil = ?');
        values.push(id_foto_perfil);
    }

    // Se nenhum campo foi enviado, retorna um erro.
    if (fields.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo fornecido para atualização.' });
    }

    // Adiciona o ID do usuário ao final do array de valores para a cláusula WHERE.
    values.push(userId);

    const sql = `UPDATE Usuarios SET ${fields.join(', ')} WHERE id_usuario = ?`;

    try {
        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Perfil atualizado com sucesso!' });

    } catch (error) {
        // Trata erro de nome de usuário duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'O nome de usuário já está em uso.' });
        }
        res.status(500).json({ error: 'Erro no servidor ao atualizar o perfil.', details: error.message });
    }
});

router.get('/:nome_usuario', async (req, res) => {
    const { nome_usuario } = req.params;
    try {
        // --- QUERY ATUALIZADA ---
        const sql = `
            SELECT 
                u.id_usuario, u.nome_completo, u.nome_usuario, u.biografia, u.data_criacao, p.url_foto,
                (SELECT COUNT(*) FROM Seguidores WHERE id_seguindo = u.id_usuario) AS total_seguidores,
                (SELECT COUNT(*) FROM Seguidores WHERE id_seguidor = u.id_usuario) AS total_seguindo
            FROM Usuarios u 
            LEFT JOIN Fotos_Perfil p ON u.id_foto_perfil = p.id_foto 
            WHERE u.nome_usuario = ?`;
            
        const [[user]] = await db.query(sql, [nome_usuario]); 
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
});

module.exports = router;