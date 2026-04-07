const Orden = require('../models/Orden');
const db = require('../config/db');

class OrdenController {
    static async crearOrden(req, res) {
        const { paciente_id, medico_id, examenes_nombres } = req.body;

        // Iniciamos una conexión para la transacción
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Crear la cabecera de la orden
            // Asumimos que Orden.crear devuelve el ID generado
            const ordenId = await Orden.crear({ paciente_id, medico_id });

            // 2. Crear los registros de exámenes vinculados
            if (examenes_nombres && Array.isArray(examenes_nombres) && examenes_nombres.length > 0) {
                
                // Usamos una sola consulta con múltiples valores para mayor velocidad
                const valores = examenes_nombres.map(nombre => [
                    paciente_id, 
                    ordenId, 
                    nombre, 
                    new Date(), 
                    'Pendiente'
                ]);

                await connection.query(
                    `INSERT INTO examenes (paciente_id, orden_id, tipo_examen, fecha, resultado) VALUES ?`,
                    [valores]
                );
            }

            // Si todo salió bien, confirmamos los cambios en la DB
            await connection.commit();
            
            res.status(201).json({ 
                mensaje: "Orden y exámenes vinculados con éxito", 
                ordenId 
            });

        } catch (error) {
            // Si algo falla, deshacemos todo para evitar datos basura
            await connection.rollback();
            console.error("Error crítico al crear orden:", error);
            res.status(500).json({ error: "Error al procesar la orden médica." });
        } finally {
            // Liberamos la conexión al pool
            connection.release();
        }
    }

    static async actualizarEstado(req, res) {
        const { id } = req.params;
        const { estado } = req.body;

        try {
            await db.query(
                'UPDATE ordenes SET estado = ? WHERE id = ?',
                [estado, id]
            );
            res.json({ mensaje: `Orden marcada como ${estado}` });
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            res.status(500).json({ error: "No se pudo actualizar el estado de la orden" });
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