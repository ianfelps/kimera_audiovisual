const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0905',
    database: 'kimera_db'
});

// criar conexao com o banco de dados
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!')
});

module.exports = db;