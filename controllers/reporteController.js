const PDFDocument = require('pdfkit');
const db = require('../config/db');

exports.generarPDF = async (req, res) => {
    const { ordenId } = req.params;

    try {
        // 1. Obtener datos de la orden, paciente y resultados
        const [resultados] = await db.query(`
            SELECT r.*, e.nombre as examen_nombre, vr.unidad, vr.minimo, vr.maximo,
                   p.nombre as paciente_nombre, o.fecha_orden
            FROM resultados r
            JOIN examenes e ON r.examen_id = e.id
            JOIN ordenes o ON r.orden_id = o.id
            JOIN pacientes p ON o.paciente_id = p.id
            LEFT JOIN valores_referencia vr ON e.id = vr.examen_id
            WHERE r.orden_id = ?
        `, [ordenId]);

        if (resultados.length === 0) {
            return res.status(404).send("No se encontraron resultados para esta orden.");
        }

        // 2. Configurar el documento PDF
        const doc = new PDFDocument({ margin: 50 });
        let filename = `Reporte_Orden_${ordenId}.pdf`;

        // Configurar cabeceras de respuesta
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- DISEÑO DEL PDF ---
        // Encabezado
        doc.fontSize(20).text('LABORATORIO CLÍNICO "PRUEBA"', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Paciente: ${resultados[0].paciente_nombre}`);
        doc.text(`Orden N°: ${ordenId}`);
        doc.text(`Fecha: ${new Date(resultados[0].fecha_orden).toLocaleDateString()}`);
        doc.moveDown();
        doc.path('M 50 150 L 550 150').stroke(); // Línea divisoria
        doc.moveDown();

        // Tabla de Resultados
        doc.fontSize(14).text('RESULTADOS DE EXÁMENES', { underline: true });
        doc.moveDown();

        resultados.forEach(resul => {
            doc.fontSize(12).fillColor('black').text(`${resul.examen_nombre}:`, { continued: true });
            
            // Si está fuera de rango, lo ponemos en ROJO
            const color = resul.fuera_de_rango ? 'red' : 'blue';
            doc.fillColor(color).text(` ${resul.valor_obtenido || 'Pendiente'} ${resul.unidad || ''}`);
            
            doc.fillColor('gray').fontSize(10).text(`Rango de ref: ${resul.minimo} - ${resul.maximo} ${resul.unidad}`);
            doc.moveDown();
        });

        // Pie de página
        doc.fontSize(10).fillColor('black').text('Generado por Sistema de Laboratorio JS 2026', 50, 700, { align: 'center' });

        doc.end();

    } catch (error) {
        console.error("Error al generar PDF:", error);
        res.status(500).send("Error al generar el reporte");
    }
};