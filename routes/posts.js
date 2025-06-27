const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('./auth');

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
        // --- QUERY ATUALIZADA ---
        const sql = `
            SELECT 
                p.id_post, 
                p.conteudo_texto, 
                p.data_publicacao, 
                u.id_usuario as id_usuario_autor,
                u.nome_usuario, 
                u.nome_completo, 
                fp.url_foto,
                (SELECT COUNT(*) FROM Curtidas WHERE id_post = p.id_post) AS total_curtidas,
                (SELECT COUNT(*) FROM Comentarios WHERE id_post = p.id_post) AS total_comentarios
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

router.delete('/:id', auth, async (req, res) => {
    const id_post = req.params.id;
    // 2. O ID do usuário logado vem do TOKEN, não do BODY. É seguro!
    const id_usuario_logado = req.user.userId; 

    try {
        // 3. A query continua a mesma, mas agora usa o ID seguro
        const sql = 'DELETE FROM Posts WHERE id_post = ? AND id_usuario_autor = ?';
        const [result] = await db.query(sql, [id_post, id_usuario_logado]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Post deletado com sucesso!' });
        } else {
            // Se affectedRows for 0, significa que ou o post não existe, ou não pertence a este usuário.
            // Para um invasor, a resposta é a mesma, o que é bom para a segurança.
            res.status(404).json({ error: 'Post não encontrado ou você não tem permissão para deletá-lo.' });
        }
    } catch (error) {
        console.error("ERRO AO DELETAR POST:", error);
        res.status(500).json({ error: 'Erro no servidor ao deletar o post.', details: error.message });
    }
});


module.exports = router;