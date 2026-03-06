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
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async crear(datos) {
        const { nombre, cedula, telefono, medico_id } = datos;
        const [result] = await db.query(
            'INSERT INTO pacientes (nombre, cedula, telefono, medico_id) VALUES (?, ?, ?, ?)',
            [nombre, cedula, telefono, medico_id || null]
        );
        return result.insertId;
    }
    
    static async actualizar(id, datos) {
        const { nombre, cedula, telefono } = datos;
        const [result] = await db.query(
            'UPDATE pacientes SET nombre = ?, cedula = ?, telefono = ? WHERE id = ?',
            [nombre, cedula, telefono, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Paciente;