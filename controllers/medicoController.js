const Medico = require('../models/Medico');

class MedicoController {
    static async listar(req, res) {
        try {
            const medicos = await Medico.obtenerTodos();
            res.json(medicos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener la lista de especialistas." });
        }
    }

    static async guardar(req, res) {
        try {
            const { nombre, especialidad, codigo_colegiado } = req.body;

            if (!nombre || nombre.trim() === "") {
                return res.status(400).json({ error: "El nombre del médico es obligatorio." });
            }
            if (!especialidad || especialidad.trim() === "") {
                return res.status(400).json({ error: "Debe especificar la especialidad médica." });
            }
            if (!codigo_colegiado || codigo_colegiado.trim() === "") {
                return res.status(400).json({ error: "El código de colegiado es requerido para el registro legal." });
            }

            const id = await Medico.crear({
                nombre: nombre.trim(),
                especialidad: especialidad.trim(),
                codigo_colegiado: codigo_colegiado.trim()
            });

            res.status(201).json({ mensaje: "Médico registrado exitosamente en el sistema", id });
            
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                return res.status(400).json({ error: "Este código de colegiado ya se encuentra registrado." });
            }
            res.status(500).json({ error: "Error interno al intentar registrar al médico." });
        }
    }

    static async borrar(req, res) {
        try {
            const { id } = req.params;
            
            const resultado = await Medico.eliminar(id);
            
            if (resultado === 0) {
                return res.status(404).json({ error: "No se encontró el médico que desea eliminar." });
            }

            res.json({ mensaje: "Médico eliminado correctamente del registro." });
        } catch (error) {
            console.error("Error al borrar médico:", error);
            res.status(500).json({ error: "Error interno al intentar eliminar al especialista." });
        }
    }
}

module.exports = MedicoController;