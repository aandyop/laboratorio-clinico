const express = require('express');
const router = express.Router();
const ValorReferenciaController = require('../controllers/valorReferenciaController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

router.get('/', ValorReferenciaController.listar);
router.post('/', autenticarToken, tieneRol('ADMIN'), ValorReferenciaController.guardar);
router.delete('/:id', autenticarToken, tieneRol('ADMIN'), ValorReferenciaController.borrar);

module.exports = router;