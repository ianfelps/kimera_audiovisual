const express = require('express');

// Importa as rotas
const usuariosRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const interacoesRouter = require('./routes/interactions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar o corpo das requisições como JSON (substitui bodyParser.json)
app.use(express.json());

// Middleware para interpretar requisições com corpo urlencoded (substitui bodyParser.urlencoded)
app.use(express.urlencoded({ extended: true }));

// Rota de "saúde" da API para verificar se está online
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API da KIMERA está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Registra as rotas importadas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/posts', postsRouter);
app.use('/api', interacoesRouter);


// Middleware para tratar erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});