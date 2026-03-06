const db = require('../config/db');

class Factura {
    static async obtenerTodas() {
        const query = `
            SELECT f.*, p.nombre AS paciente_nombre 
            FROM facturas f
            JOIN pacientes p ON f.paciente_id = p.id
            ORDER BY f.fecha DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async crear(datos) {
        const { paciente_id, monto_total, metodo_pago } = datos;
        const [result] = await db.query(
            'INSERT INTO facturas (paciente_id, monto_total, metodo_pago) VALUES (?, ?, ?)',
            [paciente_id, monto_total, metodo_pago]
        );
        return result.insertId;
    }
}

module.exports = Factura;