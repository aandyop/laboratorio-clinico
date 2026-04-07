const Orden = require('../models/Orden');
const Resultado = require('../models/Resultado');

class OrdenController {
    static async crearOrden(req, res) {
        const { paciente_id, medico_id, examenes_ids } = req.body;

        try {
            const ordenId = await Orden.crear({ paciente_id, medico_id });

            // Si hay exámenes asociados, se crean los registros de resultados "vacíos"
            if (examenes_ids && examenes_ids.length > 0) {
                for (let examenId of examenes_ids) {
                    await Resultado.registrar({
                        orden_id: ordenId,
                        examen_id: examenId,
                        valor_obtenido: null,
                        fuera_de_rango: 0
                    });
                }
            }

            res.status(201).json({ mensaje: "Orden creada con éxito", ordenId });
        } catch (error) {
            console.error("Error al crear orden:", error);
            res.status(500).json({ error: "Error interno al crear la orden" });
        }
    }

    static async listar(req, res) {
        try {
            const ordenes = await Orden.listarTodas();
            res.json(ordenes);
        } catch (error) {
            console.error("Error al listar órdenes:", error);
            res.status(500).json({ error: "Error al cargar órdenes" });
        }
    }
}

module.exports = OrdenController;