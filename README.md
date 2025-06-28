# KIMERA Audiovisual - API de Rede Social

Plataforma de rede social full-stack construída com backend Node.js/Express, banco de dados MySQL e frontend JavaScript vanilla. Apresenta API REST completa com autenticação JWT, interações em tempo real e interface responsiva.

## Visão Técnica Geral

**Arquitetura**: Padrão MVC com API RESTful  
**Backend**: Node.js + Express.js + MySQL  
**Frontend**: JavaScript Vanilla + Bootstrap 5  
**Autenticação**: Autenticação stateless baseada em JWT  
**Banco de Dados**: MySQL relacional com constraints de chave estrangeira  
**Documentação da API**: OpenAPI 3.0 (Swagger)

## Funcionalidades Principais

- Registro/autenticação de usuários com hash de senha bcrypt
- Gerenciamento de sessão baseado em JWT
- Operações CRUD para posts, comentários, curtidas e seguidores
- Atualizações de UI em tempo real via fetch API
- Controle de acesso baseado em funções
- Prevenção de SQL injection com prepared statements

## Stack Tecnológica

### Backend
- **Node.js** (v14+) - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver de banco de dados com prepared statements
- **jsonwebtoken** - Implementação JWT
- **bcryptjs** - Hash de senhas
- **dotenv** - Configuração de ambiente
- **swagger-ui-express** - Documentação da API

### Frontend
- **JavaScript Vanilla** (ES6+) - Sem dependências de framework
- **Bootstrap 5.3.6** - Framework CSS
- **Bootstrap Icons** - Biblioteca de ícones

### Banco de Dados
- **MySQL** (v5.7+) - Banco de dados relacional
- **UTF8MB4** - Suporte completo a Unicode

## Estrutura do Projeto

```text
kimera_audiovisual/
├── app.js                      # Configuração do servidor Express
├── database.js                 # Pool de conexão MySQL
├── kimera_db.sql              # Schema do banco de dados
├── routes/
│   ├── auth.js                # Middleware JWT
│   ├── users.js               # Endpoints de gerenciamento de usuários
│   ├── posts.js               # Operações CRUD de posts
│   └── interactions.js        # API de interações sociais
└── templates/                 # Assets do frontend
    ├── *.html                 # Páginas estáticas
    ├── js/                    # JavaScript do frontend
    ├── css/                   # Estilos customizados
    └── img/                   # Assets estáticos
```

## Schema do Banco de Dados

### Tabelas Principais

**Usuarios**: `id_usuario`, `nome_usuario` (UNIQUE), `email` (UNIQUE), `senha_hash`, `biografia`, `id_foto_perfil`

**Posts**: `id_post`, `conteudo_texto`, `id_usuario_autor`, `data_publicacao`

**Comentarios**: `id_comentario`, `texto_comentario`, `id_post`, `id_usuario_autor`, `data_comentario`

**Curtidas**: `id_usuario`, `id_post`, `data_curtida` (PK Composta)

**Seguidores**: `id_seguidor`, `id_seguindo`, `data_inicio` (PK Composta)

**Fotos_Perfil**: `id_foto`, `url_foto`, `descricao`

### Relacionamentos
- Usuarios → Fotos_Perfil (Muitos-para-Um)
- Posts → Usuarios (Muitos-para-Um)
- Comentarios → Posts, Usuarios (Muitos-para-Um cada)
- Curtidas → Usuarios, Posts (Junção Muitos-para-Muitos)
- Seguidores → Usuarios (Muitos-para-Muitos auto-referenciado)

## Início Rápido

### Pré-requisitos
- Node.js 14+
- MySQL 5.7+
- npm/yarn

### Configuração

1. **Configuração do Banco de Dados**
   ```sql
   mysql -u root -p < kimera_db.sql
   ```

2. **Configuração do Ambiente**
   ```bash
   cp .env.example .env
   ```
   Configure: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`

3. **Instalar e Executar**
   ```bash
   npm install
   npm start
   ```

4. **Pontos de Acesso**
   - Aplicação: http://localhost:3000
   - Documentação da API: http://localhost:3000/api-docs

## API REST

### Autenticação

Todas as rotas protegidas requerem token JWT no header:

```http
Authorization: Bearer {seu_token_jwt}
```

### Endpoints Principais

#### Usuários
```http
POST   /api/users                 # Registrar usuário
POST   /api/users/login           # Fazer login
GET    /api/users/me              # Obter perfil próprio
PUT    /api/users/editar          # Editar perfil
GET    /api/users/:nome_usuario   # Obter perfil público
```

#### Posts
```http
POST   /api/posts                 # Criar post
GET    /api/posts                 # Listar feed
GET    /api/posts/:id             # Obter post específico
DELETE /api/posts/:id             # Deletar post próprio
```

#### Interações
```http
POST   /api/interactions/users/:id/seguir           # Seguir/deixar de seguir
POST   /api/interactions/posts/:id/curtir           # Curtir/descurtir
POST   /api/interactions/posts/:id/comentar         # Comentar
GET    /api/interactions/posts/:id/comentarios      # Listar comentários
DELETE /api/interactions/comentarios/:id            # Deletar comentário
```

### Exemplo de Uso

```javascript
// Registro
const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nome_completo: 'João Silva',
        nome_usuario: 'joao.silva',
        email: 'joao@email.com',
        senha: 'senha123'
    })
});

// Login
const loginResponse = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'joao@email.com',
        senha: 'senha123'
    })
});

const { token } = await loginResponse.json();

// Criar post (autenticado)
const postResponse = await fetch('/api/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        conteudo_texto: 'Meu primeiro post!'
    })
});
```

## Arquitetura de Segurança

### Implementações de Segurança
- **Hash de Senhas**: bcrypt com salt rounds
- **JWT Stateless**: Tokens auto-contidos com expiração
- **Middleware de Autenticação**: Validação de token em rotas protegidas
- **Prepared Statements**: Prevenção de SQL injection
- **Validação de Input**: Sanitização no frontend e backend
- **CORS**: Controle de acesso cross-origin

### Fluxo de Autenticação
1. Cliente envia credenciais para `/api/users/login`
2. Servidor valida contra hash armazenado no banco
3. JWT gerado com payload do usuário (userId, username, email)
4. Token retornado e armazenado no localStorage
5. Requisições subsequentes incluem token no header Authorization
6. Middleware `auth.js` valida e decodifica token
7. Dados do usuário anexados ao objeto `req.user`

## Interface do Usuário

### Características Técnicas
- **SPA Behavior**: Navegação via JavaScript sem reload
- **Responsive Design**: Mobile-first com Bootstrap grid
- **Real-time Updates**: DOM manipulation após API calls
- **State Management**: localStorage para persistência de sessão
- **Error Handling**: Feedback visual para estados de erro

### Páginas e Funcionalidades
- **index.html**: Landing page com navegação
- **network.html**: Feed dinâmico com infinite scroll
- **profile.html**: Visualização de perfil com estatísticas
- **search.html**: Busca de usuários com filtros
- **edit-profile.html**: Formulário de edição com validação

## Desenvolvimento

### Estrutura de Arquivos
```text
routes/
├── auth.js          # Middleware: verificação JWT, extração de payload
├── users.js         # Endpoints: registro, login, perfil, edição
├── posts.js         # Endpoints: CRUD posts, validação de autorização
└── interactions.js  # Endpoints: curtidas, comentários, seguidores

templates/js/
├── network.js       # Feed dinâmico, criação de posts, interações
├── profile.js       # Exibição de perfil, estatísticas, posts do usuário
├── search.js        # Busca de usuários, paginação, filtros
├── edit-profile.js  # Formulário de edição, upload de avatar
└── login.js         # Autenticação, validação, redirecionamento
```

### Padrões de Código
- **Async/Await**: Para operações assíncronas
- **Error Handling**: Try-catch blocks com logging
- **Modularização**: Separação de responsabilidades
- **RESTful Routes**: Convenções HTTP adequadas
- **Database Transactions**: Para operações críticas
