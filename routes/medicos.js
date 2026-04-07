const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

// ESTA RUTA DEBE QUEDAR FUERA DE CUALQUIER FILTRO DE AUTENTICACIÓN
router.get('/publico', MedicoController.listarPublico);

// Todas las rutas de abajo sí están protegidas
router.get('/', autenticarToken, MedicoController.listar);
router.post('/', autenticarToken, tieneRol('ADMIN'), MedicoController.guardar);
router.delete('/:id', autenticarToken, tieneRol('ADMIN'), MedicoController.borrar);

module.exports = router;