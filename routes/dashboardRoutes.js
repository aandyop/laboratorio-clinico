const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { autenticarToken } = require('../middlewares/auth');

router.get('/', autenticarToken, DashboardController.obtenerResumen);

module.exports = router;