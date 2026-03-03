const express = require('express');
const router = express.Router();
const ExamenController = require('../controllers/examenController');

router.get('/:pacienteId', ExamenController.listarPorPaciente);
router.post('/', ExamenController.guardar);

module.exports = router;