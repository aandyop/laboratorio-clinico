const Factura = require('../models/Factura');

class FacturaController {
    static async listar(req, res) {
        try {
            const facturas = await Factura.obtenerTodas();
            res.json(facturas);
        } catch (error) {
            res.status(500).json({ error: "Error al recuperar el historial de facturación." });
        }
    }

    static async guardar(req, res) {
        try {
            const { paciente_id, monto_total, metodo_pago } = req.body;
            
            if (!paciente_id) {
                return res.status(400).json({ error: "Debe seleccionar un paciente para generar la factura." });
            }

            const montoNum = parseFloat(monto_total);
            if (isNaN(montoNum) || montoNum <= 0) {
                return res.status(400).json({ error: "El monto total debe ser un número válido mayor a 0." });
            }

            if (!metodo_pago || metodo_pago.trim() === "") {
                return res.status(400).json({ error: "El método de pago es obligatorio (Efectivo, Transferencia, etc.)." });
            }

            const id = await Factura.crear({
                paciente_id,
                monto_total: montoNum,
                metodo_pago: metodo_pago.trim()
            });

            res.status(201).json({ mensaje: "Factura generada con éxito", id });
            
        } catch (error) {
            console.error("Error en FacturaController:", error);
            res.status(500).json({ error: "Error interno al procesar la factura." });
        }
    }
}

module.exports = FacturaController;