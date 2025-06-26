const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', async (req, res) => {
    const { conteudo_texto, id_usuario_autor } = req.body;

    if (!conteudo_texto || !id_usuario_autor) {
        return res.status(400).json({ error: 'conteudo_texto e id_usuario_autor são obrigatórios.' });
    }
    
    try {
        const sql = 'INSERT INTO Posts (id_usuario_autor, conteudo_texto) VALUES (?, ?)';
        const [result] = await db.query(sql, [id_usuario_autor, conteudo_texto]);
        
        res.status(201).json({ message: 'Post criado com sucesso!', postId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar post', details: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT p.id_post, p.conteudo_texto, p.data_publicacao, u.nome_usuario, u.nome_completo, fp.url_foto
            FROM Posts p
            JOIN Usuarios u ON p.id_usuario_autor = u.id_usuario
            LEFT JOIN Fotos_Perfil fp ON u.id_foto_perfil = fp.id_foto
            ORDER BY p.data_publicacao DESC
            LIMIT 20`;
            
        const [posts] = await db.query(sql);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar posts', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT p.id_post, p.conteudo_texto, p.data_publicacao, u.nome_usuario, u.nome_completo, fp.url_foto
            FROM Posts p
            JOIN Usuarios u ON p.id_usuario_autor = u.id_usuario
            LEFT JOIN Fotos_Perfil fp ON u.id_foto_perfil = fp.id_foto
            WHERE p.id_post = ?`;
            
        const [[post]] = await db.query(sql, [id]);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar post', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const id_post = req.params.id;
    const { id_usuario_logado } = req.body; 

    if (!id_usuario_logado) {
        return res.status(401).json({ error: 'Autenticação necessária.' });
    }

    try {
        const sql = 'DELETE FROM Posts WHERE id_post = ? AND id_usuario_autor = ?';
        const [result] = await db.query(sql, [id_post, id_usuario_logado]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Post deletado com sucesso!' });
        } else {
            res.status(403).json({ error: 'Você não tem permissão para deletar este post ou o post não existe.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar post', details: error.message });
    }
});


module.exports = router;