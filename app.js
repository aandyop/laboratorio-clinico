var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var app = express(); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pacientesRouter = require('./routes/pacientes.js');
var examenesRouter = require('./routes/examenes');
const medicosRouter = require('./routes/medicos');
const inventarioRouter = require('./routes/inventario');
const valoresRouter = require('./routes/valoresReferencia');
const authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS DE VISTAS (FRONTEND) ---

// Público: Directorio de Médicos y Valores de Referencia
app.get('/medicos', (req, res) => res.render('medicos'));
app.get('/valores', (req, res) => res.render('valores'));

// La página de Login (Pública)
app.get('/login', (req, res) => res.render('login'));
app.get('/', (req, res) => res.redirect('/login')); // Redirige el inicio al login

// Privadas: Pacientes, Exámenes, etc.
app.get('/pacientes', (req, res) => res.render('pacientes'));
app.get('/examenes', (req, res) => res.render('examenes'));
app.get('/inventario', (req, res) => res.render('inventario'));
app.get('/facturas', (req, res) => res.render('facturas'));

app.use('/api/auth', authRouter);
app.use('/api/pacientes', pacientesRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/pacientes', pacientesRouter);
app.use('/api/examenes', examenesRouter);
app.use('/api/medicos', medicosRouter);
app.use('/api/facturas', require('./routes/facturas'));
app.use('/api/inventario', inventarioRouter);
app.use('/api/valores-referencia', valoresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
