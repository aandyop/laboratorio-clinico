const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

// Definimos los endpoints
router.get('/', PacienteController.listar);
router.post('/', PacienteController.guardar);

module.exports = router;