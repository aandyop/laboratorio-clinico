const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

router.get('/', autenticarToken, InventarioController.listar);
router.post('/', autenticarToken, InventarioController.guardar);

router.delete('/:id', autenticarToken, tieneRol('ADMIN'), InventarioController.borrar);

module.exports = router;