const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');
const { autenticarToken, tieneRol } = require('../middlewares/auth');

// ==========================================
// RUTA PÚBLICA (Sin Token)
// ==========================================
// Esta ruta permite que el paciente valide su DNI y Orden desde la vista pública
router.post('/verificar-resultado', PacienteController.verificarResultado);

// ==========================================
// RUTAS PRIVADAS (Requieren Token)
// ==========================================
// Estas rutas son exclusivas para el personal del laboratorio logueado

// Listar todos los pacientes
router.get('/', autenticarToken, PacienteController.listar);

// Registrar un nuevo paciente
router.post('/', autenticarToken, PacienteController.guardar);

// Editar información de un paciente existente
router.put('/:id', autenticarToken, PacienteController.editar);

// Borrar un paciente (Solo permitido para el rol ADMIN)
router.delete('/:id', autenticarToken, tieneRol('ADMIN'), PacienteController.borrar);

module.exports = router;