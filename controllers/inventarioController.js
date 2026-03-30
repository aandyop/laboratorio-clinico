const Inventario = require('../models/Inventario');

class InventarioController {
    static async listar(req, res) {
        try {
            const items = await Inventario.obtenerTodo();
            res.json(items);
        } catch (error) {
            console.error("Error al listar inventario:", error);
            res.status(500).json({ error: "Error al consultar el stock del inventario." });
        }
    }

    static async crear(req, res) {
        try {
            const { nombre_insumo, cantidad_stock, unidad_medida, fecha_vencimiento } = req.body;

            if (!nombre_insumo || nombre_insumo.trim() === "") {
                return res.status(400).json({ error: "El nombre del insumo es obligatorio." });
            }

            const cantidad = parseInt(cantidad_stock);
            if (isNaN(cantidad) || cantidad < 0) {
                return res.status(400).json({ error: "La cantidad debe ser un número válido y no negativa." });
            }

            if (!unidad_medida || unidad_medida.trim() === "") {
                return res.status(400).json({ error: "Debe especificar la unidad de medida." });
            }

            const id = await Inventario.crear({
                nombre_insumo: nombre_insumo.trim(),
                cantidad_stock: cantidad,
                unidad_medida: unidad_medida.trim(),
                fecha_vencimiento: fecha_vencimiento || null
            });

            res.status(201).json({ success: true, mensaje: "Insumo registrado correctamente", id });
            
        } catch (error) {
            console.error("Error al crear insumo:", error);
            res.status(500).json({ error: "Error interno al procesar el registro." });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const filasBorradas = await Inventario.eliminar(id);

            if (filasBorradas === 0) {
                return res.status(404).json({ error: "No se encontró el insumo." });
            }

            res.json({ success: true, mensaje: "Insumo eliminado exitosamente." });
        } catch (error) {
            console.error("Error al borrar insumo:", error);
            res.status(500).json({ error: "Error interno al intentar eliminar el insumo." });
        }
    }
}

module.exports = InventarioController;