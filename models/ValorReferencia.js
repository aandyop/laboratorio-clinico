const db = require('../config/db');

class ValorReferencia {
    static async obtenerTodo() {
        const [rows] = await db.query(`
            SELECT vr.*, e.nombre AS nombre_examen 
            FROM valores_referencia vr
            JOIN examenes e ON vr.examen_id = e.id
            ORDER BY e.nombre ASC
        `);
        return rows;
    }

    static async buscarPorExamen(examen_id) {
        const [rows] = await db.query(
            'SELECT minimo, maximo, unidad FROM valores_referencia WHERE examen_id = ?',
            [examen_id]
        );
        return rows[0];
    }

    static async crear(datos) {
        const { examen_id, minimo, maximo, unidad } = datos;
        const [result] = await db.query(
            'INSERT INTO valores_referencia (examen_id, minimo, maximo, unidad) VALUES (?, ?, ?, ?)',
            [examen_id, minimo, maximo, unidad]
        );
        return result.insertId;
    }

    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM valores_referencia WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = ValorReferencia;