const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');

router.get('/', MedicoController.listar);
router.post('/', MedicoController.guardar);

module.exports = router;