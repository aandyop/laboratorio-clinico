const db = require('../config/db');

class Examen {
    constructor(paciente_id, tipo_examen, resultado, fecha, precio = 0) {
        this.paciente_id = paciente_id;
        this.tipo_examen = tipo_examen;
        this.resultado = resultado;
        this.fecha = fecha;
        this.precio = precio;
    }

    // NUEVO: Obtener solo ID y nombre para desplegables
    static async obtenerListaSimple() {
        try {
            // Usamos 'tipo_examen' porque es el nombre real en la DB
            const [rows] = await db.query('SELECT id, tipo_examen FROM examenes ORDER BY tipo_examen ASC');
            return rows;
        } catch (error) {
            console.error("Error en Examen.obtenerListaSimple:", error);
            throw error;
        }
    }

    static async obtenerPorPaciente(pacienteId) {
        try {
            const [rows] = await db.query('SELECT * FROM examenes WHERE paciente_id = ?', [pacienteId]);
            return rows;
        } catch (error) {
            console.error("Error en Examen.obtenerPorPaciente:", error);
            throw error;
        }
    }

    static async crear(datos) {
        try {
            const { paciente_id, tipo_examen, resultado, fecha } = datos;
            const query = 'INSERT INTO examenes (paciente_id, tipo_examen, resultado, fecha) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(query, [paciente_id, tipo_examen, resultado, fecha]);
            return result.insertId;
        } catch (error) {
            console.error("Error detallado en Examen.crear:", error.message);
            throw error; 
        }
    }

    static async obtenerTodosConPaciente() {
        try {
            const query = `
                SELECT 
                    e.id, 
                    e.paciente_id,
                    e.tipo_examen, 
                    e.resultado, 
                    e.fecha,
                    e.precio,
                    p.nombre AS paciente_nombre 
                FROM examenes e
                INNER JOIN pacientes p ON e.paciente_id = p.id
                ORDER BY e.fecha DESC
            `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error en Examen.obtenerTodosConPaciente:", error);
            throw error;
        }
    }
}

module.exports = Examen;