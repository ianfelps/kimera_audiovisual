const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Importa as rotas
const usuariosRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const interacoesRouter = require('./routes/interactions');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura o Swagger
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API da KIMERA',
        version: '1.0.0',
        description: 'Uma API para aplicação de rede social com usuários, posts e interações.',
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: 'Servidor Local',
        },
    ],
    tags: [
        { name: 'Usuários', description: 'API para gerenciamento de usuários' },
        { name: 'Posts', description: 'API para gerenciamento de posts' },
        { name: 'Interações', description: 'Rotas para seguir, curtir e comentar' },
    ],
    paths: {
        '/api/usuarios': {
            post: {
                tags: ['Usuários'],
                summary: 'Cria um novo usuário',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/NovoUsuario' } } },
                },
                responses: { '201': { description: 'Usuário criado' } },
            },
        },
        '/api/usuarios/login': {
            post: {
                tags: ['Usuários'],
                summary: 'Autentica um usuário',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } },
                },
                responses: { '200': { description: 'Login bem-sucedido' } },
            },
        },
        '/api/usuarios/{nome_usuario}': {
            get: {
                tags: ['Usuários'],
                summary: 'Retorna um perfil de usuário',
                parameters: [{ name: 'nome_usuario', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'OK' } },
            },
        },
        '/api/posts': {
            post: {
                tags: ['Posts'],
                summary: 'Cria um novo post',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/NovoPost' } } },
                },
                responses: { '201': { description: 'Post criado' } },
            },
            get: {
                tags: ['Posts'],
                summary: 'Retorna uma lista dos posts mais recentes',
                responses: { '200': { description: 'OK' } },
            },
        },
        '/api/posts/{id}': {
            get: {
                tags: ['Posts'],
                summary: 'Retorna um post específico pelo ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'OK' }, '404': { description: 'Não encontrado' } },
            },
            delete: {
                tags: ['Posts'],
                summary: 'Deleta um post',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthBody' } } },
                },
                responses: { '200': { description: 'Deletado' } },
            },
        },
        '/api/usuarios/{id}/seguir': {
            post: {
                tags: ['Interações'],
                summary: 'Seguir um usuário',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthBodySeguidor' } } },
                },
                responses: { '200': { description: 'OK' } },
            },
        },
        '/api/posts/{id}/curtir': {
            post: {
                tags: ['Interações'],
                summary: 'Curtir um post',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthBodyCurtida' } } },
                },
                responses: { '200': { description: 'OK' } },
            },
        },
        '/api/posts/{id}/comentar': {
            post: {
                tags: ['Interações'],
                summary: 'Adicionar um comentário a um post',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/NovoComentario' } } },
                },
                responses: { '201': { description: 'Comentário adicionado' } },
            },
        },
    },
    components: {
        schemas: {
            NovoUsuario: {
                type: 'object',
                properties: {
                    nome_completo: { type: 'string' },
                    nome_usuario: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    senha: { type: 'string', format: 'password' },
                    id_foto_perfil: { type: 'integer' },
                },
            },
            Login: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    senha: { type: 'string', format: 'password' },
                },
            },
            NovoPost: {
                type: 'object',
                properties: {
                    conteudo_texto: { type: 'string' },
                    id_usuario_autor: { type: 'integer' },
                },
            },
            NovoComentario: {
                type: 'object',
                properties: {
                    id_usuario_autor: { type: 'integer' },
                    texto_comentario: { type: 'string' },
                },
            },
            AuthBody: {
                type: 'object',
                properties: { id_usuario_logado: { type: 'integer' } },
            },
            AuthBodySeguidor: {
                type: 'object',
                properties: { id_seguidor: { type: 'integer' } },
            },
            AuthBodyCurtida: {
                type: 'object',
                properties: { id_usuario_curtiu: { type: 'integer' } },
            },
        },
    },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para interpretar o corpo das requisições como JSON (substitui bodyParser.json)
app.use(express.json());

// Middleware para interpretar requisições com corpo urlencoded (substitui bodyParser.urlencoded)
app.use(express.urlencoded({ extended: true }));

// Configura o servidor para servir arquivos estáticos
const path = require('path');
// diretorio dos arquivos estaticos
app.use(express.static(path.join(__dirname, 'templates')));

// Rota para página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'))
});

// Rota de "saúde" da API para verificar se está online
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API da KIMERA está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Registra as rotas importadas para API
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
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
});