const Examen = require('../models/Examen');

class ExamenController {
    static async listarPorPaciente(req, res) {
        try {
            const resultados = await Examen.obtenerPorPaciente(req.params.pacienteId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async guardar(req, res) {
        try {
            const id = await Examen.crear(req.body);
            res.status(201).json({ mensaje: "Examen registrado", id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async listarTodos(req, res) {
        try {
            const resultados = await Examen.obtenerTodosConPaciente();
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ExamenController;