const express = require('express');
const router = express.Router();
const ResultadoController = require('../controllers/resultadoController');
const { autenticarToken } = require('../middlewares/auth');

// RUTA PÚBLICA: Para que el paciente consulte (validado previamente por el controlador de pacientes)
router.get('/orden/:ordenId', ResultadoController.verPorOrden);

// RUTA PRIVADA: Solo personal puede registrar valores
router.post('/guardar', autenticarToken, ResultadoController.registrarValor);

module.exports = router;