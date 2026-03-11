const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/facturaController');
const { autenticarToken } = require('../middlewares/auth');

router.get('/', autenticarToken, FacturaController.listar);
router.post('/', autenticarToken, FacturaController.guardar);

module.exports = router;