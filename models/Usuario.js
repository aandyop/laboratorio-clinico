const db = require('../config/db');
const bcrypt = require('bcrypt');

class Usuario {
    static async buscarPorEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }

    static async crear(datos) {
        const { email, password, rol } = datos;

        if (!email || !password) {
            throw new Error("El email y la contraseña son obligatorios");
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const [result] = await db.query(
            'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)',
            [email, passwordHash, rol || 'USER']
        );
        return result.insertId;
    }
}

module.exports = Usuario;