const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/facturaController');

router.get('/', FacturaController.listar);
router.post('/', FacturaController.guardar);

module.exports = router;