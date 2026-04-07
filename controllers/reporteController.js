const PDFDocument = require('pdfkit');
const db = require('../config/db');

exports.generarPDF = async (req, res) => {
    // IMPORTANTE: Asegúrate de que en reporteRoutes.js la ruta sea /pdf/:ordenId
    const { ordenId } = req.params;

    try {
        // 1. Obtener datos con JOIN para asegurar que la orden tenga exámenes
        const [registros] = await db.query(`
            SELECT e.tipo_examen, e.resultado, e.precio, 
                   p.nombre as paciente_nombre, 
                   o.fecha as fecha_orden
            FROM examenes e
            JOIN ordenes o ON e.orden_id = o.id
            JOIN pacientes p ON o.paciente_id = p.id
            WHERE e.orden_id = ?
        `, [ordenId]);

        // Si no hay registros, significa que el orden_id en la tabla 'examenes' es NULL 
        // o la orden no existe.
        if (registros.length === 0) {
            return res.status(404).render('error', { 
                mensaje: "No se encontraron exámenes para esta orden. Verifique que los resultados estén vinculados al ID de orden correcto." 
            });
        }

        // 2. Configurar el PDF
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        let filename = `Reporte_Orden_${ordenId}.pdf`;

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');
        
        doc.pipe(res);

        // --- DISEÑO DEL REPORTE ---
        doc.fontSize(22).text('LABORATORIO CLÍNICO "PRUEBA"', { align: 'center' });
        doc.fontSize(10).text('Calle Principal #123 - Tel: 555-0123', { align: 'center' });
        doc.moveDown();
        
        // Información de cabecera
        doc.fontSize(12).fillColor('#333')
           .text(`Paciente: `, { continued: true }).fillColor('black').text(registros[0].paciente_nombre)
           .text(`Orden N°: `, { continued: true }).fillColor('black').text(ordenId)
           .text(`Fecha de Emisión: `, { continued: true }).fillColor('black').text(new Date(registros[0].fecha_orden).toLocaleDateString());
        
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); 
        doc.moveDown();

        doc.fontSize(14).fillColor('#002e5d').text('RESULTADOS DE ANÁLISIS', { underline: true });
        doc.moveDown();

        // Listado de exámenes
        registros.forEach(item => {
            doc.fontSize(12).fillColor('black').text(`${item.tipo_examen}:`, { continued: true });
            
            const valor = item.resultado || 'Pendiente de análisis';
            const colorResultado = item.resultado ? 'blue' : 'red';
            
            doc.fillColor(colorResultado).text(` ${valor}`);
            
            if (item.precio > 0) {
                doc.fillColor('gray').fontSize(9).text(`  Importe: $${item.precio}`);
            }
            doc.moveDown(0.5);
        });

        // Pie de página
        const bottomPos = doc.page.height - 70;
        doc.fontSize(10).fillColor('black')
           .text('Este documento es un reporte oficial del sistema LabSys.', 50, bottomPos, { align: 'center' })
           .text('Firma Autorizada: ________________________', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error("Error crítico al generar PDF:", error);
        res.status(500).send("Error interno al generar el PDF.");
    }
};