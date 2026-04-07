const db = require('../config/db');

class DashboardController {
    static async obtenerResumen(req, res) {
        try {
            // 1. Total Facturado Hoy
            // Usamos 'fecha_emision' según tu captura image_07e368.png
            const [facturacion] = await db.query(
                'SELECT SUM(total) as total FROM facturas WHERE DATE(fecha_emision) = CURDATE()'
            );
            
            // 2. Conteo de Órdenes del día
            // Usamos 'fecha' según tu captura image_07e09e.png
            const [ordenesHoy] = await db.query(
                'SELECT COUNT(*) as total FROM ordenes WHERE DATE(fecha) = CURDATE()'
            );
            
            // 3. Stock Crítico
            // Asumimos que la tabla inventario sigue igual
            const [inventario] = await db.query(
                'SELECT COUNT(*) as bajos FROM inventario WHERE cantidad_stock < 10'
            );
            
            // 4. Alertas de Salud
            // Usamos 'o.fecha' para el JOIN, que es el nombre real en la tabla ordenes
            const [alertas] = await db.query(
                `SELECT COUNT(*) as alertas 
                 FROM resultados r 
                 JOIN ordenes o ON r.orden_id = o.id 
                 WHERE r.fuera_de_rango = 1 AND DATE(o.fecha) = CURDATE()`
            );

            res.json({
                totalFacturado: facturacion[0].total || "0.00",
                totalOrdenes: ordenesHoy[0].total || 0,
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