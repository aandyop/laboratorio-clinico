const Medico = require('../models/Medico');

class MedicoController {
    static async listar(req, res) {
        try {
            const medicos = await Medico.obtenerTodos();
            res.json(medicos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async guardar(req, res) {
        try {
            const id = await Medico.crear(req.body);
            res.status(201).json({ mensaje: "Médico registrado", id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = MedicoController;