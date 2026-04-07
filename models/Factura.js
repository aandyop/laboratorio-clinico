const db = require('../config/db');

class Factura {
    // Obtener todas las facturas con el nombre del paciente unido
    static async obtenerTodas() {
        try {
            const query = `
                SELECT 
                    f.*, 
                    p.nombre AS paciente_nombre 
                FROM facturas f
                JOIN pacientes p ON f.paciente_id = p.id
                ORDER BY f.fecha_emision DESC
            `;
            const [rows] = await db.query(query);
            return rows; 
        } catch (error) {
            // Si hay un error (ej. columna inexistente), logueamos y devolvemos array vacío
            // Esto evita que el frontend falle al intentar hacer un .forEach()
            console.error("Error en Factura.obtenerTodas:", error.message);
            return []; 
        }
    }

    // Crear una nueva factura en la base de datos
    static async crear(datos) {
        try {
            const { paciente_id, monto_total, metodo_pago } = datos;
            
            // Esta consulta asume que ya ejecutaste el ALTER TABLE para agregar 'metodo_pago'
            const query = 'INSERT INTO facturas (paciente_id, monto_total, metodo_pago) VALUES (?, ?, ?)';
            
            const [result] = await db.query(query, [paciente_id, monto_total, metodo_pago]);
            
            return result.insertId;
        } catch (error) {
            // Imprimimos el error específico de SQL (ej. "Unknown column") en la consola de VS Code
            console.error("Error detallado en Factura.crear:", error.sqlMessage || error.message);
            throw error; 
        }
    }
}

module.exports = Factura;