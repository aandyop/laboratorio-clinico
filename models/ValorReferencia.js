const db = require('../config/db');

class ValorReferencia {
    /**
     * 1. Obtener todos los registros con el nombre del examen.
     * Corregido: Se usa 'tipo_examen' según la estructura de la DB
     */
    static async obtenerTodos() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    vr.id, 
                    vr.examen_id, 
                    vr.minimo, 
                    vr.maximo, 
                    vr.unidad, 
                    e.tipo_examen AS nombre_examen 
                FROM valores_referencia vr
                JOIN examenes e ON vr.examen_id = e.id
                ORDER BY e.tipo_examen ASC
            `);
            // Retorna un array vacío si no hay filas para evitar errores en el frontend
            return rows || []; 
        } catch (error) {
            console.error("Error en ValorReferencia.obtenerTodos:", error);
            throw error;
        }
    }

    /**
     * 2. Buscar rangos específicos por ID de examen.
     * Usa los nombres de columna exactos: minimo, maximo
     */
    static async buscarPorExamen(examen_id) {
        try {
            const [rows] = await db.query(
                'SELECT minimo, maximo, unidad FROM valores_referencia WHERE examen_id = ?',
                [examen_id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error en buscarPorExamen:", error);
            throw error;
        }
    }

    /**
     * 3. Crear nuevo registro.
     * Validación para evitar ER_BAD_NULL_ERROR en examen_id
     */
    static async crear(datos) {
        try {
            const { examen_id, minimo, maximo, unidad } = datos;
            
            if (!examen_id) {
                throw new Error("El ID del examen es obligatorio para la base de datos.");
            }

            const [result] = await db.query(
                'INSERT INTO valores_referencia (examen_id, minimo, maximo, unidad) VALUES (?, ?, ?, ?)',
                [examen_id, minimo, maximo, unidad]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error al crear valor de referencia:", error);
            throw error;
        }
    }

    /**
     * 4. Eliminar registro por ID.
     */
    static async eliminar(id) {
        try {
            const [result] = await db.query('DELETE FROM valores_referencia WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error al eliminar valor de referencia:", error);
            throw error;
        }
    }
}

module.exports = ValorReferencia;