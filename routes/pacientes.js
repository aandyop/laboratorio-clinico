const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

router.get('/', autenticarToken, PacienteController.listar);
router.post('/', autenticarToken, PacienteController.guardar);
router.put('/:id', autenticarToken, PacienteController.editar);

router.delete('/:id', autenticarToken, tieneRol('ADMIN'), PacienteController.borrar);

module.exports = router;