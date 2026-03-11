const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

router.get('/', MedicoController.listar);

router.post('/', autenticarToken, tieneRol('ADMIN'), MedicoController.guardar);
router.delete('/:id', autenticarToken, tieneRol('ADMIN'), MedicoController.borrar);

module.exports = router;