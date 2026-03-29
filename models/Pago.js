const db = require('../config/db');

class Pago {
    static async registrar({ factura_id, monto, metodo_pago }) {
        const [result] = await db.query(
            'INSERT INTO pagos (factura_id, monto, metodo_pago) VALUES (?, ?, ?)',
            [factura_id, monto, metodo_pago]
        );
        return result;
    }

    static async ingresosMensuales() {
        const [rows] = await db.query(`
            SELECT MONTH(fecha_pago) as mes, SUM(monto) as total 
            FROM pagos 
            WHERE YEAR(fecha_pago) = YEAR(CURRENT_DATE)
            GROUP BY MONTH(fecha_pago)
        `);
        return rows;
    }
}
module.exports = Pago;