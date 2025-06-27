const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('./auth');

router.post('/', auth, async (req, res) => {
    const { conteudo_texto } = req.body;
    const id_usuario_autor = req.user.userId; // ID vem do token

    if (!conteudo_texto) {
        return res.status(400).json({ error: 'conteudo_texto é obrigatório.' });
    }
    
    try {
        const sql = 'INSERT INTO Posts (id_usuario_autor, conteudo_texto) VALUES (?, ?)';
        const [result] = await db.query(sql, [id_usuario_autor, conteudo_texto]);
        
        res.status(201).json({ message: 'Post criado com sucesso!', postId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar post', details: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    const loggedUserId = req.user.userId;
    
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
                (SELECT COUNT(*) FROM Curtidas WHERE id_post = p.id_post) AS likes_count,
                (SELECT COUNT(*) FROM Comentarios WHERE id_post = p.id_post) AS comments_count,
                (SELECT COUNT(*) > 0 FROM Curtidas WHERE id_post = p.id_post AND id_usuario_curtiu = ?) AS has_liked,
                (SELECT COUNT(*) > 0 FROM Seguidores WHERE id_seguindo = u.id_usuario AND id_seguidor = ?) AS is_following
            FROM Posts p
            JOIN Usuarios u ON p.id_usuario_autor = u.id_usuario
            LEFT JOIN Fotos_Perfil fp ON u.id_foto_perfil = fp.id_foto
            ORDER BY p.data_publicacao DESC
            LIMIT 20`;
            
        const [posts] = await db.query(sql, [loggedUserId, loggedUserId]);
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