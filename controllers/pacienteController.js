const Paciente = require('../models/Paciente');

class PacienteController {
    static async listar(req, res) {
        try {
            const pacientes = await Paciente.obtenerTodos();
            res.json(pacientes);
        } catch (error) {
            console.error("Error al listar pacientes:", error);
            res.status(500).json({ error: "Error al obtener pacientes", detalle: error.message });
        }
    }

    static async guardar(req, res) {
        try {
            const { nombre, cedula, telefono, medico_id } = req.body;

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
            console.error("Error al guardar paciente:", error);
            
            if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE')) {
                return res.status(400).json({ error: "Ya existe un paciente registrado con esa cédula." });
            }
            
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: "El médico seleccionado no es válido o no existe." });
            }

            res.status(500).json({ error: "Error interno al guardar el paciente.", detalle: error.message });
        }
    }

    static async editar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, cedula, telefono, medico_id } = req.body;

            if (!nombre || !cedula) {
                return res.status(400).json({ error: "No puede dejar el nombre o la cédula vacíos." });
            }

            const filasAfectadas = await Paciente.actualizar(id, req.body);
            
            if (filasAfectadas === 0) {
                return res.status(404).json({ error: "Paciente no encontrado." });
            }

            res.json({ mensaje: "Datos del paciente actualizados correctamente." });
        } catch (error) {
            console.error("Error al editar paciente:", error);
            res.status(500).json({ error: "Error al actualizar", detalle: error.message });
        }
    }

    static async borrar(req, res) {
        try {
            const id = req.params.id;
            
            if (!id) {
                return res.status(400).json({ error: "Es necesario el ID del paciente para eliminarlo." });
            }

            const filasEliminadas = await Paciente.eliminar(id);
            
            if (filasEliminadas === 0) {
                return res.status(404).json({ error: "El paciente no existe." });
            }

            res.json({ mensaje: "Paciente eliminado correctamente del sistema." });
        } catch (error) {
            console.error("Error al borrar paciente:", error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ error: "No se puede eliminar el paciente porque tiene registros asociados (exámenes o facturas)." });
            }
            res.status(500).json({ error: "No se pudo eliminar el paciente." });
        }
    }
}

module.exports = PacienteController;