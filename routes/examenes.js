const express = require('express');
const router = express.Router();
const ExamenController = require('../controllers/examenController');

router.get('/', ExamenController.listarTodos); 
router.get('/:pacienteId', ExamenController.listarPorPaciente);
router.post('/', ExamenController.guardar);

router.get('/:pacienteId', ExamenController.listarPorPaciente);
router.post('/', ExamenController.guardar);

module.exports = router;