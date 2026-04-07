const db = require('../config/db');

class Paciente {
    constructor(nombre, cedula, telefono) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.telefono = telefono;
    }

    /**
     * NUEVO: Valida si una orden pertenece a un paciente específico.
     * Cruza la tabla de pacientes con la de órdenes por ID y Cédula.
     */
    static async validarOrden(cedula, ordenId) {
        try {
            const query = `
                SELECT p.nombre, o.id AS orden_id 
                FROM pacientes p
                JOIN ordenes o ON p.id = o.paciente_id
                WHERE p.cedula = ? AND o.id = ?
                LIMIT 1
            `;
            const [rows] = await db.execute(query, [cedula, ordenId]);
            
            // Retorna el primer resultado si existe, o null si no hay coincidencia
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error en Paciente.validarOrden:", error);
            throw error;
        }
    }

    static async obtenerTodos() {
        const query = `
            SELECT p.*, m.nombre AS medico_nombre 
            FROM pacientes p 
            LEFT JOIN medicos m ON p.medico_id = m.id
            ORDER BY p.id DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async crear(datos) {
        const { nombre, cedula, telefono, medico_id } = datos;
        const [result] = await db.execute(
            'INSERT INTO pacientes (nombre, cedula, telefono, medico_id) VALUES (?, ?, ?, ?)',
            [nombre, cedula, telefono, medico_id || null]
        );
        return result.insertId;
    }
    
    static async actualizar(id, datos) {
        const { nombre, cedula, telefono, medico_id } = datos;
        const [result] = await db.execute(
            'UPDATE pacientes SET nombre = ?, cedula = ?, telefono = ?, medico_id = ? WHERE id = ?',
            [nombre, cedula, telefono, medico_id || null, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await db.execute('DELETE FROM pacientes WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Paciente;