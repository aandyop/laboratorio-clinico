const db = require('../config/db');

class Paciente {
    constructor(nombre, cedula, telefono) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.telefono = telefono;
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
        // CORRECCIÓN: Agregado medico_id para que se pueda editar el médico del paciente
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