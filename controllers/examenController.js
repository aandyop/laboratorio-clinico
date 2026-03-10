const Examen = require('../models/Examen');

class ExamenController {
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
            const { paciente_id, tipo_examen, resultado, fecha } = req.body;

            if (!paciente_id) {
                return res.status(400).json({ error: "Debe seleccionar un paciente para asignar el examen." });
            }
            if (!tipo_examen || tipo_examen.trim() === "") {
                return res.status(400).json({ error: "El tipo de examen (Hemograma, Orina, etc.) es obligatorio." });
            }
            if (!resultado || resultado.trim() === "") {
                return res.status(400).json({ error: "Debe ingresar el resultado del examen." });
            }
            if (!fecha) {
                return res.status(400).json({ error: "La fecha de realización es obligatoria." });
            }

            const id = await Examen.crear({
                paciente_id,
                tipo_examen: tipo_examen.trim(),
                resultado: resultado.trim(),
                fecha
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
            if (!pacienteId) {
                return res.status(400).json({ error: "ID de paciente no proporcionado." });
            }

            const resultados = await Examen.obtenerPorPaciente(pacienteId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener exámenes del paciente.", detalle: error.message });
        }
    }
}

module.exports = ExamenController;