const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');
const { verificarToken, tieneRol } = require('../middleware/authMiddleware');

router.get('/', verificarToken, MedicoController.listar);

router.post('/', verificarToken, tieneRol('ADMIN'), MedicoController.guardar);

module.exports = router;