const db = require('../config/db');
const bcrypt = require('bcrypt');

class Usuario {
    static async buscarPorUsername(username) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    }

    static async crear(datos) {
        const { username, password, rol } = datos;

        if (!username || !password) {
            throw new Error("El nombre de usuario y la contraseña son obligatorios");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
            [username, passwordHash, rol || 'USER']
        );
        return result.insertId;
    }
}

module.exports = Usuario;