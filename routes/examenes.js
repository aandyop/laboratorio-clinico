const express = require('express');
const router = express.Router();
const ExamenController = require('../controllers/examenController');
const { autenticarToken } = require('../middlewares/auth');

router.get('/', autenticarToken, ExamenController.listarTodos);
router.get('/:pacienteId', autenticarToken, ExamenController.listarPorPaciente);
router.post('/', autenticarToken, ExamenController.guardar);

module.exports = router;