const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

// === IMPORTACIÓN DE MIDDLEWARES ===
const { autenticarToken } = require('./middlewares/auth');

const app = express(); 

// Configuración del motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// === IMPORTACIÓN DE RUTAS ===
const authRouter = require('./routes/auth');
const pacientesRouter = require('./routes/pacientes');
const examenesRouter = require('./routes/examenes');
const medicosRouter = require('./routes/medicos');
const inventarioRouter = require('./routes/inventario');
const facturaRoutes = require('./routes/facturas');
const valoresRouter = require('./routes/valoresReferencia');
const ordenesRouter = require('./routes/ordenes');
const resultadosRouter = require('./routes/resultados');
const reportesRoutes = require('./routes/reporteRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// RUTAS DE VISTAS (FRONTEND - RENDERIZADO)
// ==========================================
// Nota: Estas rutas sirven el HTML. La seguridad se maneja en el cliente (localStorage)
app.get('/login', (req, res) => res.render('login'));
app.get('/', (req, res) => res.render('index', { title: 'Panel de Control - Laboratorio' }));
app.get('/medicos', (req, res) => res.render('medicos'));
app.get('/valores', (req, res) => res.render('valoresReferencia')); 
app.get('/pacientes', (req, res) => res.render('pacientes'));
app.get('/examenes', (req, res) => res.render('examenes'));
app.get('/inventario', (req, res) => res.render('inventario'));
app.get('/facturas', (req, res) => res.render('facturas'));
app.get('/ordenes', (req, res) => res.render('ordenes'));

// Rutas públicas
app.get('/consultar-resultados', (req, res) => res.render('consulta_paciente', { title: "Consultar Resultados" }));
app.get('/medicos/directorio', (req, res) => res.render('directorio_publico', { title: "Nuestros Especialistas" }));

// ==========================================
// RUTAS DE LA API (BACKEND - DATOS)
// ==========================================

// 1. Públicas
app.use('/api/auth', authRouter);

// 2. Protegidas con Token
app.use('/api/dashboard', autenticarToken, dashboardRouter); // IMPORTANTE: Para el fetch de index.ejs
app.use('/api/pacientes', autenticarToken, pacientesRouter);
app.use('/api/examenes', autenticarToken, examenesRouter);
app.use('/api/medicos', autenticarToken, medicosRouter);
app.use('/api/inventario', autenticarToken, inventarioRouter);
app.use('/api/facturas', autenticarToken, facturaRoutes);
app.use('/api/valores-referencia', autenticarToken, valoresRouter);
app.use('/api/ordenes', autenticarToken, ordenesRouter); 
app.use('/api/resultados', autenticarToken, resultadosRouter);
app.use('/api/reportes', autenticarToken, reportesRoutes);
app.use('/api/users', autenticarToken, usersRouter);

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// Capturar 404
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    // Configurar mensajes de error
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    const status = err.status || 500;
    res.status(status);
    
    // Si la petición falla en la API, responder JSON (Evita que el fetch se rompa)
    if (req.originalUrl.startsWith('/api/')) {
        return res.json({ 
            error: err.message,
            code: err.code || 'SERVER_ERROR'
        });
    }
    
    res.render('error');
});

module.exports = app;