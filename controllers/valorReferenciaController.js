const ValorReferencia = require('../models/ValorReferencia');

class ValorReferenciaController {
    static async listar(req, res) {
        try {
            const valores = await ValorReferencia.obtenerTodo();
            res.json(valores);
        } catch (error) {
            res.status(500).json({ error: "Error al consultar los rangos de referencia." });
        }
    }

    static async guardar(req, res) {
        try {
            const { nombre_examen, valor_minimo, valor_maximo, unidad } = req.body;

            if (!nombre_examen || nombre_examen.trim() === "") {
                return res.status(400).json({ error: "El nombre del examen es obligatorio." });
            }
            if (!unidad || unidad.trim() === "") {
                return res.status(400).json({ error: "Debe especificar la unidad de medida (mg/dL, g/L, etc.)." });
            }

            const min = parseFloat(valor_minimo);
            const max = parseFloat(valor_maximo);

            if (isNaN(min) || isNaN(max)) {
                return res.status(400).json({ error: "Los valores de referencia deben ser números válidos." });
            }

            if (min >= max) {
                return res.status(400).json({ 
                    error: "Error lógico: El valor mínimo no puede ser mayor o igual al valor máximo." 
                });
            }

            const id = await ValorReferencia.crear({
                nombre_examen: nombre_examen.trim(),
                valor_minimo: min,
                valor_maximo: max,
                unidad: unidad.trim()
            });

            res.status(201).json({ mensaje: "Rango de referencia guardado con éxito", id });
            
        } catch (error) {
            console.error("Error en ValorReferenciaController:", error);
            res.status(500).json({ error: "Error interno al procesar los valores de referencia." });
        }
    }
}

module.exports = ValorReferenciaController;