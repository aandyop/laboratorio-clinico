const Resultado = require('../models/Resultado');
const ValorReferencia = require('../models/ValorReferencia');
const db = require('../config/db');

class ResultadoController {
    static async verPorOrden(req, res) {
        const { ordenId } = req.params;
        try {
            const [resultados] = await db.query(`
                SELECT r.*, e.nombre as examen_nombre, vr.unidad, vr.minimo, vr.maximo
                FROM resultados r
                JOIN examenes e ON r.examen_id = e.id
                LEFT JOIN valores_referencia vr ON e.id = vr.examen_id
                WHERE r.orden_id = ?
            `, [ordenId]);

            res.render('resultados_orden', { resultados, ordenId });
        } catch (error) {
            console.error("Error al cargar resultados:", error);
            res.status(500).send("Error al cargar los resultados de la orden");
        }
    }

    static async registrarValor(req, res) {
        const { resultado_id, valor_obtenido } = req.body;

        try {
            // 1. Obtener el examen_id y el nombre del examen
            const [rows] = await db.query(`
                SELECT r.examen_id, e.nombre as examen_nombre 
                FROM resultados r 
                JOIN examenes e ON r.examen_id = e.id 
                WHERE r.id = ?
            `, [resultado_id]);

            if (rows.length === 0) return res.status(404).json({ error: "Resultado no encontrado" });
            
            const { examen_id, examen_nombre } = rows[0];

            // 2. Buscar límites en el modelo de ValorReferencia
            const limites = await ValorReferencia.buscarPorExamen(examen_id);

            // 3. Lógica de cálculo automático
            let fueraDeRango = 0;
            if (limites && valor_obtenido !== "") {
                const valor = parseFloat(valor_obtenido);
                if (valor < limites.minimo || valor > limites.maximo) {
                    fueraDeRango = 1; 
                }
            }

            // 4. Actualización del resultado en DB
            await db.query(
                'UPDATE resultados SET valor_obtenido = ?, fuera_de_rango = ? WHERE id = ?',
                [valor_obtenido, fueraDeRango, resultado_id]
            );

            await db.query(`
                UPDATE inventario 
                SET cantidad_stock = cantidad_stock - 1 
                WHERE nombre_insumo LIKE ? AND cantidad_stock > 0
            `, [`%${examen_nombre}%`]);
            // -------------------------------------------------------

            res.json({ 
                mensaje: "Resultado guardado y stock actualizado", 
                fueraDeRango: fueraDeRango === 1 
            });

        } catch (error) {
            console.error("Error en registrarValor:", error);
            res.status(500).json({ error: "Error interno al procesar el resultado" });
        }
    }
}

module.exports = ResultadoController;