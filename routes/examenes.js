const express = require('express');
const router = express.Router();

/**
 * IMPORTACIÓN DEL CONTROLADOR
 * Se mantiene en singular 'examenController' para coincidir con tu archivo físico 
 * y no romper otras dependencias del proyecto.
 */
const ExamenController = require('../controllers/examenController'); 
const { autenticarToken } = require('../middlewares/auth');

// ==========================================
// RUTAS DE LA API PARA EXÁMENES
// ==========================================

/**
 * @route   GET /api/examenes/unicos
 * @desc    Obtiene la lista de tipos de exámenes sin duplicados (SELECT DISTINCT).
 * Utilizada por: Configuración de Valores Ref. y Formulario de Nueva Orden.
 */
router.get('/unicos', autenticarToken, ExamenController.listarTiposUnicos);

/**
 * @route   GET /api/examenes/
 * @desc    Lista todos los registros de exámenes (historial completo).
 */
router.get('/', autenticarToken, ExamenController.listarTodos);

/**
 * @route   GET /api/examenes/:pacienteId
 * @desc    Obtiene los exámenes asociados a un paciente específico.
 */
router.get('/:pacienteId', autenticarToken, ExamenController.listarPorPaciente);

/**
 * @route   PUT /api/examenes/:id
 * @desc    Actualiza el resultado o datos de un examen existente.
 */
router.put('/:id', autenticarToken, ExamenController.actualizar);

/**
 * @route   DELETE /api/examenes/:id
 * @desc    Elimina un registro de examen de la base de datos.
 */
router.delete('/:id', autenticarToken, ExamenController.eliminar);

module.exports = router;