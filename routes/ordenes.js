const express = require('express');
const router = express.Router();
const OrdenController = require('../controllers/ordenController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

// Listar todas las órdenes (Accesible para ADMIN y BIOANALISTA)
router.get('/', autenticarToken, OrdenController.listar);

// Crear una nueva orden (Solo ADMIN o Recepción)
router.post('/crear', autenticarToken, OrdenController.crearOrden);

module.exports = router;