const db = require('../config/db');

class Inventario {
    static async obtenerTodo() {
        const [rows] = await db.query('SELECT * FROM inventario ORDER BY nombre_insumo ASC');
        return rows;
    }

    static async crear(datos) {
        const { nombre_insumo, cantidad_stock, unidad_medida, fecha_vencimiento } = datos;
        const [result] = await db.query(
            'INSERT INTO inventario (nombre_insumo, cantidad_stock, unidad_medida, fecha_vencimiento) VALUES (?, ?, ?, ?)',
            [nombre_insumo, cantidad_stock, unidad_medida, fecha_vencimiento]
        );
        return result.insertId;
    }

    static async actualizarStock(id, nuevaCantidad) {
        await db.query('UPDATE inventario SET cantidad_stock = ? WHERE id = ?', [nuevaCantidad, id]);
    }

    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM inventario WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Inventario;