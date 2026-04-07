const Medico = require('../models/Medico');

class MedicoController {
    /**
     * NUEVO: Listado para el Directorio Público (Sin token)
     * Devuelve solo la información necesaria para el visitante.
     */
    static async listarPublico(req, res) {
        try {
            const medicos = await Medico.obtenerTodos();
            
            // Mapeamos los datos para enviar solo lo que el público debe ver
            const directorio = medicos.map(m => ({
                nombre: m.nombre,
                especialidad: m.especialidad,
                licencia: m.codigo_colegiado, // Usamos codigo_colegiado como licencia
                telefono: m.telefono || "Consultar en clínica"
            }));

            res.json(directorio);
        } catch (error) {
            console.error("Error en MedicoController.listarPublico:", error);
            res.status(500).json({ error: "Error al obtener el directorio médico." });
        }
    }

    /**
     * Listado para el Área Privada (Requiere token)
     */
    static async listar(req, res) {
        try {
            const medicos = await Medico.obtenerTodos();
            res.json(medicos);
        } catch (error) {
            console.error("Error al listar médicos:", error);
            res.status(500).json({ error: "Error al obtener la lista de especialistas." });
        }
    }

    /**
     * Guardar nuevo médico (Solo ADMIN)
     */
    static async guardar(req, res) {
        try {
            const { nombre, especialidad, codigo_colegiado } = req.body;

            if (!nombre?.trim() || !especialidad?.trim() || !codigo_colegiado?.trim()) {
                return res.status(400).json({ error: "Todos los campos son obligatorios." });
            }

            const id = await Medico.crear({
                nombre: nombre.trim(),
                especialidad: especialidad.trim(),
                codigo_colegiado: codigo_colegiado.trim()
            });

            res.status(201).json({ mensaje: "Médico registrado exitosamente", id });
            
        } catch (error) {
            console.error("Error al guardar médico:", error);
            if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE')) {
                return res.status(400).json({ error: "Este código de colegiado ya existe." });
            }
            res.status(500).json({ error: "Error interno al intentar registrar al médico." });
        }
    }

    /**
     * Borrar médico (Solo ADMIN)
     */
    static async borrar(req, res) {
        try {
            const { id } = req.params;
            
            const resultado = await Medico.eliminar(id);
            
            if (resultado === 0) {
                return res.status(404).json({ error: "No se encontró el médico que desea eliminar." });
            }

            res.json({ mensaje: "Médico eliminado correctamente." });
        } catch (error) {
            console.error("Error al borrar médico:", error);
            
            // Error de clave foránea (si el médico ya tiene pacientes asignados)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ error: "No se puede eliminar: este médico tiene pacientes asociados." });
            }

            res.status(500).json({ error: "Error interno al intentar eliminar al especialista." });
        }
    }
}

module.exports = MedicoController;