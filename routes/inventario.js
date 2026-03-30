const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

router.get('/', InventarioController.listar);

router.post('/', autenticarToken, tieneRol('ADMIN'), InventarioController.crear);

router.delete('/:id', autenticarToken, tieneRol('ADMIN'), InventarioController.eliminar);

module.exports = router;