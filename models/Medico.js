const db = require('../config/db');

class Medico {
    // Obtener todos los médicos registrados
    static async obtenerTodos() {
        try {
            const [rows] = await db.query('SELECT * FROM medicos ORDER BY nombre ASC');
            return rows;
        } catch (error) {
            console.error("Error en Medico.obtenerTodos:", error.message);
            throw error;
        }
    }

    // Crear un nuevo médico
    static async crear(datos) {
        try {
            const { nombre, especialidad, codigo_colegiado } = datos;
            
            // IMPORTANTE: Esta consulta requiere que hayas ejecutado el ALTER TABLE en phpMyAdmin
            const query = 'INSERT INTO medicos (nombre, especialidad, codigo_colegiado) VALUES (?, ?, ?)';
            
            const [result] = await db.query(query, [nombre, especialidad, codigo_colegiado]);
            
            return result.insertId;
        } catch (error) {
            // Este log te dirá exactamente qué columna falta o qué valor está mal
            console.error("Error detallado en Medico.crear:", error.sqlMessage || error.message);
            throw error; 
        }
    }

    // Eliminar un médico por ID
    static async eliminar(id) {
        try {
            const [result] = await db.query('DELETE FROM medicos WHERE id = ?', [id]);
            return result.affectedRows; 
        } catch (error) {
            console.error("Error en Medico.eliminar:", error.message);
            throw error;
        }
    }
}

module.exports = Medico;