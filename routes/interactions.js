const express = require('express');
const router = express.Router();
const db = require('../database');

// --- SEGUIDORES ---

// POST /api/usuarios/:id/seguir
router.post('/usuarios/:id/seguir', async (req, res) => {
    const id_seguindo = req.params.id;
    // IMPORTANTE: O id do seguidor deve vir de um token de autenticação.
    const { id_seguidor } = req.body; 

    if (id_seguidor === id_seguindo) {
        return res.status(400).json({ error: 'Um usuário não pode seguir a si mesmo.' });
    }

    try {
        const sql = 'INSERT INTO Seguidores (id_seguidor, id_seguindo) VALUES (?, ?)';
        await db.query(sql, [id_seguidor, id_seguindo]);
        res.status(200).json({ message: 'Usuário seguido com sucesso!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Você já segue este usuário.' });
        }
        res.status(500).json({ error: 'Erro ao seguir usuário.', details: error.message });
    }
});

// DELETE /api/usuarios/:id/deixar-de-seguir
router.delete('/usuarios/:id/deixar-de-seguir', async (req, res) => {
    const id_seguindo = req.params.id;
    // IMPORTANTE: O id do seguidor deve vir de um token.
    const { id_seguidor } = req.body;

    try {
        const sql = 'DELETE FROM Seguidores WHERE id_seguidor = ? AND id_seguindo = ?';
        const [result] = await db.query(sql, [id_seguidor, id_seguindo]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Deixou de seguir o usuário com sucesso!' });
        } else {
            res.status(404).json({ message: 'Relação de seguir não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deixar de seguir usuário.', details: error.message });
    }
});

// --- CURTIDAS ---

// POST /api/posts/:id/curtir
router.post('/posts/:id/curtir', async (req, res) => {
    const id_post = req.params.id;
    // IMPORTANTE: O id do usuário deve vir de um token.
    const { id_usuario_curtiu } = req.body;

    try {
        const sql = 'INSERT INTO Curtidas (id_post, id_usuario_curtiu) VALUES (?, ?)';
        await db.query(sql, [id_post, id_usuario_curtiu]);
        res.status(200).json({ message: 'Post curtido com sucesso!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Você já curtiu este post.' });
        }
        res.status(500).json({ error: 'Erro ao curtir o post.', details: error.message });
    }
});

// DELETE /api/posts/:id/descurtir
router.delete('/posts/:id/descurtir', async (req, res) => {
    const id_post = req.params.id;
    // IMPORTANTE: O id do usuário deve vir de um token.
    const { id_usuario_curtiu } = req.body;

    try {
        const sql = 'DELETE FROM Curtidas WHERE id_post = ? AND id_usuario_curtiu = ?';
        const [result] = await db.query(sql, [id_post, id_usuario_curtiu]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Post descurtido com sucesso!' });
        } else {
            res.status(404).json({ message: 'Curtida não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao descurtir o post.', details: error.message });
    }
});

// --- COMENTÁRIOS ---

// POST /api/posts/:id/comentar
router.post('/posts/:id/comentar', async (req, res) => {
    const id_post = req.params.id;
    // IMPORTANTE: O id do autor deve vir de um token.
    const { id_usuario_autor, texto_comentario } = req.body;

    if (!texto_comentario) {
        return res.status(400).json({ error: 'O texto do comentário não pode ser vazio.' });
    }

    try {
        const sql = 'INSERT INTO Comentarios (id_post, id_usuario_autor, texto_comentario) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [id_post, id_usuario_autor, texto_comentario]);
        res.status(201).json({ message: 'Comentário adicionado!', comentarioId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar comentário.', details: error.message });
    }
});

// GET /api/posts/:id/comentarios
router.get('/posts/:id/comentarios', async (req, res) => {
    const id_post = req.params.id;
    try {
        const sql = `
            SELECT c.id_comentario, c.texto_comentario, c.data_comentario, u.nome_usuario, p.url_foto
            FROM Comentarios c
            JOIN Usuarios u ON c.id_usuario_autor = u.id_usuario
            LEFT JOIN Fotos_Perfil p ON u.id_foto_perfil = p.id_foto
            WHERE c.id_post = ?
            ORDER BY c.data_comentario ASC`;
            
        const [comentarios] = await db.query(sql, [id_post]);
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar comentários', details: error.message });
    }
});


module.exports = router;