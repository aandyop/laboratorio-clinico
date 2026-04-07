const express = require('express');
const router = express.Router();
const OrdenController = require('../controllers/ordenController');
const { autenticarToken } = require('../middlewares/auth');

// Obtener listado de órdenes
router.get('/', autenticarToken, OrdenController.listar);

// Crear nueva orden
router.post('/', autenticarToken, OrdenController.crearOrden);

// NUEVA: Actualizar estado de la orden (ej. de Pendiente a Completada)
router.put('/:id/estado', autenticarToken, OrdenController.actualizarEstado);

module.exports = router;