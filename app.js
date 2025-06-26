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
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Insira o token JWT no formato: Bearer {token}'
            }
        },
        schemas: {
            NovoUsuario: {
                type: 'object',
                properties: {
                    nome_completo: { type: 'string', example: 'João da Silva' },
                    nome_usuario: { type: 'string', example: 'joao.silva' },
                    email: { type: 'string', format: 'email', example: 'joao@exemplo.com' },
                    senha: { type: 'string', format: 'password', example: 'senha123' },
                },
            },
            Login: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    senha: { type: 'string', format: 'password' },
                },
            },
            UserProfile: {
                type: 'object',
                properties: {
                    id_usuario: { type: 'integer', example: 1 },
                    nome_completo: { type: 'string', example: 'Nome Completo do Usuário' },
                    nome_usuario: { type: 'string', example: 'nome.de.usuario' },
                    biografia: { type: 'string', example: 'Esta é a minha biografia.' },
                    data_criacao: { type: 'string', format: 'date-time' },
                    url_foto: { type: 'string', format: 'uri', example: 'img/icons/ico01.png' }
                }
            },
            UpdateProfile: {
                type: 'object',
                properties: {
                    nome_completo: { type: 'string' },
                    nome_usuario: { type: 'string' },
                    biografia: { type: 'string' },
                    id_foto_perfil: { type: 'integer' }
                }
            },
            NovoPost: {
                type: 'object',
                properties: {
                    conteudo_texto: { type: 'string' },
                },
            },
            NovoComentario: {
                type: 'object',
                properties: {
                    texto_comentario: { type: 'string', example: 'Ótimo post!' },
                },
            },
            Comentario: {
                type: 'object',
                properties: {
                    id_comentario: { type: 'integer' },
                    texto_comentario: { type: 'string' },
                    data_comentario: { type: 'string', format: 'date-time' },
                    nome_usuario: { type: 'string' },
                    url_foto: { type: 'string', format: 'uri' },
                }
            }
        },
    },
    paths: {
        '/api/usuarios': {
            post: {
                tags: ['Usuários'],
                summary: 'Cria um novo usuário (Registro)',
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
                summary: 'Autentica um usuário e retorna um token JWT',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } },
                },
                responses: {
                    '200': { description: 'Login bem-sucedido, token retornado' },
                    '401': { description: 'Credenciais inválidas' },
                },
            },
        },
        '/api/users/profile/me': {
            get: {
                tags: ['Usuários'],
                summary: 'Retorna o perfil do usuário atualmente logado',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Perfil do usuário retornado com sucesso',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } }
                    },
                    '401': { description: 'Não autorizado' },
                }
            }
        },
        '/api/users/profile': {
            put: {
                tags: ['Usuários'],
                summary: 'Atualiza o perfil do usuário atualmente logado',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfile' } } }
                },
                responses: {
                    '200': { description: 'Perfil atualizado com sucesso' },
                    '401': { description: 'Não autorizado' },
                }
            }
        },
        '/api/usuarios/{nome_usuario}': {
            get: {
                tags: ['Usuários'],
                summary: 'Retorna um perfil de usuário público pelo nome de usuário',
                parameters: [{ name: 'nome_usuario', in: 'path', required: true, description: 'Nome de usuário a ser buscado', schema: { type: 'string' } }],
                responses: {
                    '200': {
                        description: 'Perfil do usuário retornado com sucesso',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } }
                    },
                    '404': { description: 'Usuário não encontrado' }
                },
            },
        },
        '/api/posts': {
            post: {
                tags: ['Posts'],
                summary: 'Cria um novo post',
                security: [{ bearerAuth: [] }],
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
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'Deletado' } },
            },
        },
        '/api/usuarios/{id}/seguir': {
            post: {
                tags: ['Interações'],
                summary: 'Seguir ou deixar de seguir um usuário (toggle)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, description: 'ID do usuário a ser seguido/deixado de seguir', schema: { type: 'integer' } }],
                responses: {
                    '200': { description: 'Ação de seguir/deixar de seguir executada com sucesso' }
                },
            },
        },
        '/api/posts/{id}/curtir': {
            post: {
                tags: ['Interações'],
                summary: 'Curtir ou descurtir um post (toggle)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, description: 'ID do post a ser curtido/descurtido', schema: { type: 'integer' } }],
                responses: { '200': { description: 'Ação de curtir/descurtir executada com sucesso' } },
            },
        },
        '/api/posts/{id}/comentar': {
            post: {
                tags: ['Interações'],
                summary: 'Adicionar um comentário a um post',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/NovoComentario' } } },
                },
                responses: { '201': { description: 'Comentário adicionado' } },
            },
        },
        '/api/posts/{id}/comentarios': {
            get: {
                tags: ['Interações'],
                summary: 'Busca todos os comentários de um post específico',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    '200': {
                        description: 'Lista de comentários retornada com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Comentario' }
                                }
                            }
                        }
                    },
                },
            },
        },
        '/api/comentarios/{id}': {
            delete: {
                tags: ['Interações'],
                summary: 'Deleta um comentário que pertence ao usuário logado',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, description: 'ID do comentário a ser deletado', schema: { type: 'integer' } }],
                responses: {
                    '200': { description: 'Comentário deletado com sucesso' },
                    '403': { description: 'Acesso negado (não é o autor do comentário)' },
                    '404': { description: 'Comentário não encontrado' }
                },
            },
        },
    },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const path = require('path');
app.use(express.static(path.join(__dirname, 'templates')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'))
});

app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API da KIMERA está funcionando!',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/posts', postsRouter);
app.use('/api', interacoesRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
});