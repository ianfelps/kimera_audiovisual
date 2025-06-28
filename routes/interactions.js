const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('./auth'); // Assumindo que o middleware está na pasta 'routes'

// --- SEGUIDORES (Lógica de Toggle) ---
// Uma única rota para seguir ou deixar de seguir um usuário
router.post('/users/:id/seguir', auth, async (req, res) => {
    const id_seguindo = req.params.id;
    const id_seguidor = req.user.userId; // ID do usuário logado vem do token

    if (parseInt(id_seguidor, 10) === parseInt(id_seguindo, 10)) {
        return res.status(400).json({ error: 'Um usuário não pode interagir consigo mesmo.' });
    }

    try {
        // 1. Verifica se a relação já existe
        const checkSql = 'SELECT * FROM Seguidores WHERE id_seguidor = ? AND id_seguindo = ?';
        const [existing] = await db.query(checkSql, [id_seguidor, id_seguindo]);

        if (existing.length > 0) {
            // 2. Se já segue, deixa de seguir (DELETE)
            const deleteSql = 'DELETE FROM Seguidores WHERE id_seguidor = ? AND id_seguindo = ?';
            await db.query(deleteSql, [id_seguidor, id_seguindo]);
            res.status(200).json({ message: 'Deixou de seguir o usuário.', seguiu: false });
        } else {
            // 3. Se não segue, passa a seguir (INSERT)
            const insertSql = 'INSERT INTO Seguidores (id_seguidor, id_seguindo) VALUES (?, ?)';
            await db.query(insertSql, [id_seguidor, id_seguindo]);
            res.status(200).json({ message: 'Usuário seguido com sucesso!', seguiu: true });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao interagir com o usuário.', details: error.message });
    }
});


// --- CURTIDAS (Lógica de Toggle) ---
// Uma única rota para curtir ou descurtir um post
router.post('/posts/:id/curtir', auth, async (req, res) => {
    const id_post = req.params.id;
    const id_usuario_curtiu = req.user.userId; // ID vem do token

    try {
        // 1. Verifica se já curtiu
        const checkSql = 'SELECT * FROM Curtidas WHERE id_post = ? AND id_usuario_curtiu = ?';
        const [existing] = await db.query(checkSql, [id_post, id_usuario_curtiu]);

        if (existing.length > 0) {
            // 2. Se já curtiu, descurte (DELETE)
            const deleteSql = 'DELETE FROM Curtidas WHERE id_post = ? AND id_usuario_curtiu = ?';
            await db.query(deleteSql, [id_post, id_usuario_curtiu]);
            
            // Retorna contagem atualizada
            const countSql = 'SELECT COUNT(*) as count FROM Curtidas WHERE id_post = ?';
            const [[{count}]] = await db.query(countSql, [id_post]);
            
            res.status(200).json({ message: 'Post descurtido.', curtiu: false, likes_count: count });
        } else {
            // 3. Se não curtiu, curte (INSERT)
            const insertSql = 'INSERT INTO Curtidas (id_post, id_usuario_curtiu) VALUES (?, ?)';
            await db.query(insertSql, [id_post, id_usuario_curtiu]);
            
            // Retorna contagem atualizada
            const countSql = 'SELECT COUNT(*) as count FROM Curtidas WHERE id_post = ?';
            const [[{count}]] = await db.query(countSql, [id_post]);
            
            res.status(200).json({ message: 'Post curtido com sucesso!', curtiu: true, likes_count: count });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao interagir com o post.', details: error.message });
    }
});


// --- COMENTÁRIOS ---
router.post('/posts/:id/comentar', auth, async (req, res) => {
    const id_post = req.params.id;
    const id_usuario_autor = req.user.userId; // ID vem do token
    const { texto_comentario } = req.body;

    if (!texto_comentario) {
        return res.status(400).json({ error: 'O texto do comentário não pode ser vazio.' });
    }

    try {
        const sql = 'INSERT INTO Comentarios (id_post, id_usuario_autor, texto_comentario) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [id_post, id_usuario_autor, texto_comentario]);
        
        // Retorna contagem atualizada de comentários
        const countSql = 'SELECT COUNT(*) as count FROM Comentarios WHERE id_post = ?';
        const [[{count}]] = await db.query(countSql, [id_post]);
        
        res.status(201).json({ message: 'Comentário adicionado!', comentarioId: result.insertId, comments_count: count });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar comentário.', details: error.message });
    }
});

// GET para buscar todos os comentários de um post (rota pública)
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

// NOVO: Rota para DELETAR um comentário
router.delete('/comentarios/:id', auth, async (req, res) => {
    const id_comentario = req.params.id;
    const id_usuario_logado = req.user.userId; // ID do usuário logado

    try {
        // 1. Verifica quem é o autor do comentário
        const checkSql = 'SELECT id_usuario_autor FROM Comentarios WHERE id_comentario = ?';
        const [[comentario]] = await db.query(checkSql, [id_comentario]);

        if (!comentario) {
            return res.status(404).json({ error: 'Comentário não encontrado.' });
        }

        // 2. Compara o autor com o usuário logado
        if (comentario.id_usuario_autor !== id_usuario_logado) {
            return res.status(403).json({ error: 'Acesso negado. Você não pode deletar o comentário de outra pessoa.' });
        }

        // 3. Se for o autor, deleta o comentário
        const deleteSql = 'DELETE FROM Comentarios WHERE id_comentario = ?';
        await db.query(deleteSql, [id_comentario]);

        res.status(200).json({ message: 'Comentário deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ao deletar o comentário.', details: error.message });
    }
});

module.exports = router;