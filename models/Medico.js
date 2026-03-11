const db = require('../config/db');

class Medico {
    static async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM medicos');
        return rows;
    }

    static async crear(datos) {
        const { nombre, especialidad, codigo_colegiado } = datos;
        const [result] = await db.query(
            'INSERT INTO medicos (nombre, especialidad, codigo_colegiado) VALUES (?, ?, ?)',
            [nombre, especialidad, codigo_colegiado]
        );
        return result.insertId;
    }

    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM medicos WHERE id = ?', [id]);
        return result.affectedRows; 
    }
}

module.exports = Medico;