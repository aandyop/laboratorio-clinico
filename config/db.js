const mysql = require('mysql2/promise');

// Creamos un pool de conexiones (más eficiente para sistemas escalables)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Usuario por defecto de XAMPP
    password: '',      // Contraseña por defecto de XAMPP (vacía)
    database: 'laboratorio_clinico',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;