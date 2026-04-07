const db = require('../config/db');

class Orden {
    static async crear({ paciente_id, medico_id }) {
        try {
            // Usamos 'fecha' (tras el cambio en SQL) y 'Pendiente' (tal cual el ENUM de tu imagen)
            const query = 'INSERT INTO ordenes (paciente_id, medico_id, fecha, estado) VALUES (?, ?, NOW(), ?)';
            const [result] = await db.query(query, [paciente_id, medico_id, 'Pendiente']);
            return result.insertId;
        } catch (error) {
            console.error("Error en Orden.crear:", error.sqlMessage || error.message);
            throw error;
        }
    }

    static async listarTodas() {
        try {
            const query = `
                SELECT o.id, o.fecha, o.estado,
                       p.nombre AS paciente_nombre,
                       m.nombre AS medico_nombre
                FROM ordenes o
                LEFT JOIN pacientes p ON o.paciente_id = p.id
                LEFT JOIN medicos m ON o.medico_id = m.id
                ORDER BY o.fecha DESC
            `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error en Orden.listarTodas:", error.message);
            throw error;
        }
    }
}

module.exports = Orden;