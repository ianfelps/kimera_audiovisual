const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // Pega o token do cabeçalho 'Authorization'
    const authHeader = req.headers.authorization;

    // Verifica se o cabeçalho existe e se começa com "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    // Extrai o token (remove o "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Verifica e decodifica o token usando a chave secreta
        const decoded = jwt.verify(token, JWT_SECRET);

        // Adiciona o payload do usuário (que contém o ID) ao objeto da requisição
        req.user = decoded;

        // Continua para a próxima função (a rota que foi chamada)
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;