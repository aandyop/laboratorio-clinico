const Paciente = require('../models/Paciente');

class PacienteController {
    static async listar(req, res) {
        try {
            const pacientes = await Paciente.obtenerTodos();
            res.json(pacientes);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener pacientes", detalle: error.message });
        }
    }

    static async guardar(req, res) {
        try {
            const { nombre, cedula, telefono } = req.body;

            if (!nombre || nombre.trim() === "") {
                return res.status(400).json({ error: "El nombre del paciente es obligatorio." });
            }
            if (!cedula || cedula.trim() === "") {
                return res.status(400).json({ error: "La cédula es obligatoria para el registro." });
            }
            if (!telefono || telefono.trim() === "") {
                return res.status(400).json({ error: "Debe proporcionar un número de teléfono de contacto." });
            }

            const nuevoId = await Paciente.crear(req.body);
            res.status(201).json({ mensaje: "Paciente guardado con éxito", id: nuevoId });
            
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                return res.status(400).json({ error: "Ya existe un paciente registrado con esa cédula." });
            }
            res.status(500).json({ error: "Error interno al guardar el paciente." });
        }
    }

    static async editar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, cedula } = req.body;

            if (nombre === "" || cedula === "") {
                return res.status(400).json({ error: "No puede dejar el nombre o la cédula vacíos." });
            }

            await Paciente.actualizar(id, req.body);
            res.json({ mensaje: "Datos del paciente actualizados." });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar", detalle: error.message });
        }
    }

    static async borrar(req, res) {
        try {
            const id = req.params.id;
            
            if (!id) {
                return res.status(400).json({ error: "Es necesario el ID del paciente para eliminarlo." });
            }

            await Paciente.eliminar(id);
            res.json({ mensaje: "Paciente eliminado correctamente del sistema." });
        } catch (error) {
            res.status(500).json({ error: "No se pudo eliminar el paciente. Verifique si tiene exámenes asociados." });
        }
    }
}

module.exports = PacienteController;