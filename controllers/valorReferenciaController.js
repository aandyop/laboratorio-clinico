const ValorReferencia = require('../models/ValorReferencia');

class ValorReferenciaController {
    static async listar(req, res) {
        try {
            // Cambiado a obtenerTodos() para coincidir con el modelo corregido
            const valores = await ValorReferencia.obtenerTodos();
            
            // Si por alguna razón valores es null, enviamos un array vacío para que el .forEach no rompa el frontend
            res.json(valores || []); 
        } catch (error) {
            console.error("Error al listar valores:", error);
            res.status(500).json({ error: "Error al consultar los rangos de referencia." });
        }
    }

    static async guardar(req, res) {
        try {
            // IMPORTANTE: Extraemos examen_id, minimo y maximo para coincidir con la DB
            const { examen_id, minimo, maximo, unidad } = req.body;

            // Validación de examen_id para evitar el error ER_BAD_NULL_ERROR
            if (!examen_id) {
                return res.status(400).json({ error: "Debe seleccionar un examen válido." });
            }
            
            if (!unidad || unidad.trim() === "") {
                return res.status(400).json({ error: "Debe especificar la unidad de medida." });
            }

            const min = parseFloat(minimo);
            const max = parseFloat(maximo);

            if (isNaN(min) || isNaN(max)) {
                return res.status(400).json({ error: "Los valores de referencia deben ser números válidos." });
            }

            if (min >= max) {
                return res.status(400).json({ 
                    error: "Error lógico: El valor mínimo no puede ser mayor o igual al valor máximo." 
                });
            }

            // Enviamos los datos al modelo con los nombres correctos: minimo y maximo
            const id = await ValorReferencia.crear({
                examen_id: parseInt(examen_id),
                minimo: min,
                maximo: max,
                unidad: unidad.trim()
            });

            res.status(201).json({ mensaje: "Rango de referencia guardado con éxito", id });
            
        } catch (error) {
            console.error("Error en ValorReferenciaController:", error);
            res.status(500).json({ error: "Error interno al procesar los valores de referencia." });
        }
    }

    static async borrar(req, res) {
        try {
            const { id } = req.params;
            const filasBorradas = await ValorReferencia.eliminar(id);

            if (filasBorradas === 0) {
                return res.status(404).json({ error: "No se encontró el rango de referencia para eliminar." });
            }

            res.json({ mensaje: "Rango de referencia eliminado correctamente." });
        } catch (error) {
            console.error("Error al borrar valor de referencia:", error);
            res.status(500).json({ error: "Error interno al intentar eliminar el registro." });
        }
    }
}

module.exports = ValorReferenciaController;