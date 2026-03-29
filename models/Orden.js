const db = require('../config/db');

class Orden {
    static async crear({ paciente_id, medico_id }) {
        const [result] = await db.query(
            'INSERT INTO ordenes (paciente_id, medico_id) VALUES (?, ?)',
            [paciente_id, medico_id]
        );
        return result.insertId;
    }

    static async listarTodas() {
        const [rows] = await db.query(`
            SELECT o.*, p.nombre as paciente, m.nombre as medico 
            FROM ordenes o
            JOIN pacientes p ON o.paciente_id = p.id
            JOIN medicos m ON o.medico_id = m.id
            ORDER BY o.fecha_orden DESC
        `);
        return rows;
    }
}
module.exports = Orden;