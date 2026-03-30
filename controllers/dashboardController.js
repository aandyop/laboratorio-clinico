const db = require('../config/db');

class DashboardController {
    static async obtenerResumen(req, res) {
        try {
            const [facturacion] = await db.query(
                'SELECT SUM(total) as total FROM facturas WHERE DATE(fecha) = CURDATE()'
            );
            
            const [inventario] = await db.query(
                'SELECT COUNT(*) as bajos FROM inventario WHERE cantidad_stock < 10'
            );
            
            const [alertas] = await db.query(
                'SELECT COUNT(*) as alertas FROM resultados WHERE fuera_de_rango = 1 AND DATE(updated_at) = CURDATE()'
            );

            res.json({
                totalFacturado: facturacion[0].total || "0.00",
                insumosBajos: inventario[0].bajos || 0,
                alertasSalud: alertas[0].alertas || 0
            });
        } catch (error) {
            console.error("Error en el Dashboard:", error);
            res.status(500).json({ error: "Error al cargar estadísticas" });
        }
    }
}

module.exports = DashboardController;