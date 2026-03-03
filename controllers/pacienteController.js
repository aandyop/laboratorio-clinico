const Paciente = require('../models/Paciente');

class PacienteController {
    // Método para obtener todos los pacientes (GET)
    static async listar(req, res) {
        try {
            const pacientes = await Paciente.obtenerTodos();
            res.json(pacientes);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener pacientes", error: error.message });
        }
    }

    // Método para crear un paciente (POST)
    static async guardar(req, res) {
        try {
            const nuevoId = await Paciente.crear(req.body);
            res.status(201).json({ mensaje: "Paciente guardado con éxito", id: nuevoId });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al guardar paciente", error: error.message });
        }
    }
}

module.exports = PacienteController;