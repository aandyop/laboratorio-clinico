const db = require('../config/db');

class Examen {
    constructor(paciente_id, tipo_examen, resultado, fecha) {
        this.paciente_id = paciente_id;
        this.tipo_examen = tipo_examen;
        this.resultado = resultado;
        this.fecha = fecha;
    }

    // Uso de Promesas para obtener exámenes por paciente
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
}

module.exports = Examen;