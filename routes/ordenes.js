const express = require('express');
const router = express.Router();
const OrdenController = require('../controllers/ordenController');
const { autenticarToken } = require('../middlewares/auth');

// Obtener listado de órdenes (GET /api/ordenes)
router.get('/', autenticarToken, OrdenController.listar);

// Crear nueva orden (POST /api/ordenes)
router.post('/', autenticarToken, OrdenController.crearOrden);

module.exports = router;