const Orden = require('../models/Orden');
const Resultado = require('../models/Resultado');
const Examen = require('../models/Examen');

class OrdenController {
    static async crearOrden(req, res) {
        const { paciente_id, medico_id, examenes_ids } = req.body;

        try {
            const ordenId = await Orden.crear({ paciente_id, medico_id });

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
            console.error(error);
            res.status(500).json({ error: "Error al crear la orden" });
        }
    }

    static async listar(req, res) {
        try {
            const ordenes = await Orden.listarTodas();
            res.render('ordenes', { ordenes }); // Crear vista ejs
        } catch (error) {
            res.status(500).send("Error al cargar órdenes");
        }
    }
}

module.exports = OrdenController;