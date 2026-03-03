const db = require('../config/db');

class Paciente {
    constructor(nombre, cedula, telefono) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.telefono = telefono;
    }

    static async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM pacientes');
        return rows;
    }

    static async crear(datos) {
        const { nombre, cedula, telefono } = datos;
        const [result] = await db.query(
            'INSERT INTO pacientes (nombre, cedula, telefono) VALUES (?, ?, ?)',
            [nombre, cedula, telefono]
        );
        return result.insertId;
    }
}

module.exports = Paciente;