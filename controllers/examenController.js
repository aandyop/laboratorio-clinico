const Examen = require('../models/Examen');
const db = require('../config/db');

class ExamenController {
    // CORREGIDO: Listar nombres únicos para el select de Configuración
    static async listarTiposUnicos(req, res) {
        try {
            // Añadimos WHERE para no traer campos vacíos y ORDER BY para orden alfabético
            const query = `
                SELECT DISTINCT tipo_examen 
                FROM examenes 
                WHERE tipo_examen IS NOT NULL AND tipo_examen != '' 
                ORDER BY tipo_examen ASC
            `;
            const [tipos] = await db.query(query);
            res.json(tipos);
        } catch (error) {
            console.error("Error al obtener tipos únicos:", error);
            res.status(500).json({ error: "Error al cargar el catálogo de exámenes." });
        }
    }

    static async listarTodos(req, res) {
        try {
            const resultados = await Examen.obtenerTodosConPaciente();
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: "Error al recuperar el historial clínico.", detalle: error.message });
        }
    }

    static async guardar(req, res) {
        try {
            const { paciente_id, tipo_examen, resultado, precio, fecha, orden_id } = req.body;

            if (!paciente_id) return res.status(400).json({ error: "Debe seleccionar un paciente." });
            if (!tipo_examen || tipo_examen.trim() === "") return res.status(400).json({ error: "El tipo de examen es obligatorio." });

            const id = await Examen.crear({
                paciente_id,
                tipo_examen: tipo_examen.trim(),
                resultado: resultado ? resultado.trim() : null,
                precio: precio || 0,
                fecha: fecha || new Date(),
                orden_id: orden_id || null
            });

            res.status(201).json({ mensaje: "Examen registrado exitosamente", id });
        } catch (error) {
            console.error("Error en ExamenController:", error);
            res.status(500).json({ error: "Error interno al registrar el examen." });
        }
    }

    static async listarPorPaciente(req, res) {
        try {
            const { pacienteId } = req.params;
            const resultados = await Examen.obtenerPorPaciente(pacienteId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener exámenes del paciente.", detalle: error.message });
        }
    }

    static async eliminar(req, res) {
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM examenes WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "El examen no existe o ya fue eliminado." });
            }

            res.json({ mensaje: "Examen eliminado correctamente." });
        } catch (error) {
            console.error("Error al eliminar examen:", error);
            res.status(500).json({ error: "Error interno al procesar la eliminación." });
        }
    }

    static async actualizar(req, res) {
        const { id } = req.params;
        const { resultado } = req.body;

        try {
            const [result] = await db.query(
                'UPDATE examenes SET resultado = ? WHERE id = ?',
                [resultado, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "No se encontró el examen." });
            }

            res.json({ mensaje: "Resultado actualizado correctamente." });
        } catch (error) {
            console.error("Error al actualizar resultado:", error);
            res.status(500).json({ error: "Error interno al actualizar el resultado." });
        }
    }
}

module.exports = ExamenController;