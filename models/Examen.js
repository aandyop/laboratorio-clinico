const db = require('../config/db');

class Examen {
    constructor(paciente_id, tipo_examen, resultado, fecha) {
        this.paciente_id = paciente_id;
        this.tipo_examen = tipo_examen;
        this.resultado = resultado;
        this.fecha = fecha;
    }

    static async obtenerPorPaciente(pacienteId) {
        const [rows] = await db.query('SELECT * FROM examenes WHERE paciente_id = ?', [pacienteId]);
        return rows;
    }

    static async crear(datos) {
        const { paciente_id, tipo_examen, resultado, fecha } = datos;
        const [result] = await db.query(
            'INSERT INTO examenes (paciente_id, tipo_examen, resultado, fecha) VALUES (?, ?, ?, ?)',
            [paciente_id, tipo_examen, resultado, fecha]
        );
        return result.insertId;
    }

    static async obtenerTodosConPaciente() {
        const query = `
            SELECT e.id, e.tipo_examen, e.resultado, e.fecha, p.nombre AS paciente_nombre 
            FROM examenes e
            INNER JOIN pacientes p ON e.paciente_id = p.id
            ORDER BY e.fecha DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = Examen;