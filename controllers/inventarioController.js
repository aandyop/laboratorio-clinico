const Inventario = require('../models/Inventario');

class InventarioController {
    static async listar(req, res) {
        try {
            const items = await Inventario.obtenerTodo();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: "Error al consultar el stock del inventario." });
        }
    }

    static async guardar(req, res) {
        try {
            const { nombre_insumo, cantidad_stock, unidad_medida, fecha_vencimiento } = req.body;

            if (!nombre_insumo || nombre_insumo.trim() === "") {
                return res.status(400).json({ error: "El nombre del insumo es obligatorio." });
            }

            const cantidad = parseInt(cantidad_stock);
            if (isNaN(cantidad)) {
                return res.status(400).json({ error: "La cantidad de stock debe ser un número válido." });
            }
            if (cantidad < 0) {
                return res.status(400).json({ error: "No se permiten cantidades de stock negativas." });
            }

            if (!unidad_medida || unidad_medida.trim() === "") {
                return res.status(400).json({ error: "Debe especificar la unidad de medida (ej: Unidades, ml, mg)." });
            }

            const id = await Inventario.crear({
                nombre_insumo: nombre_insumo.trim(),
                cantidad_stock: cantidad,
                unidad_medida: unidad_medida.trim(),
                fecha_vencimiento: fecha_vencimiento || null
            });

            res.status(201).json({ mensaje: "Insumo registrado correctamente", id });
            
        } catch (error) {
            console.error("Error en InventarioController:", error);
            res.status(500).json({ error: "Error interno al procesar el registro de inventario." });
        }
    }
}

module.exports = InventarioController;