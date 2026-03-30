const express = require('express');
const router = express.Router();
const ResultadoController = require('../controllers/resultadoController');
const { autenticarToken } = require('../middlewares/auth');

router.get('/orden/:ordenId', ResultadoController.verPorOrden);

router.post('/guardar', ResultadoController.registrarValor);

module.exports = router;