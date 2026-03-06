const Factura = require('../models/Factura');

class FacturaController {
    static async listar(req, res) {
        try {
            const facturas = await Factura.obtenerTodas();
            res.json(facturas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async guardar(req, res) {
        try {
            const id = await Factura.crear(req.body);
            res.status(201).json({ mensaje: "Factura generada con éxito", id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = FacturaController;