const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/descargar/:ordenId', reporteController.generarPDF);

module.exports = router;