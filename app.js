const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const app = express(); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pacientesRouter = require('./routes/pacientes');
const examenesRouter = require('./routes/examenes');
const medicosRouter = require('./routes/medicos');
const inventarioRouter = require('./routes/inventario');
const facturaRoutes = require('./routes/facturas');
const valoresRouter = require('./routes/valoresReferencia');
const authRouter = require('./routes/auth');
const ordenesRouter = require('./routes/ordenes');
const resultadosRouter = require('./routes/resultados');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => res.render('login'));
app.get('/', (req, res) => res.redirect('/login')); 

app.get('/medicos', (req, res) => res.render('medicos'));
app.get('/valores', (req, res) => res.render('valoresReferencia')); 

app.get('/pacientes', (req, res) => res.render('pacientes'));
app.get('/examenes', (req, res) => res.render('examenes'));
app.get('/inventario', (req, res) => res.render('inventario'));

app.get('/facturas', (req, res) => res.render('facturas'));

app.use('/api/auth', authRouter);
app.use('/api/pacientes', pacientesRouter);
app.use('/api/examenes', examenesRouter);
app.use('/api/medicos', medicosRouter);
app.use('/api/inventario', inventarioRouter);
app.use('/api/facturas', facturaRoutes);
app.use('/api/valores-referencia', valoresRouter);
app.use('/ordenes', ordenesRouter);
app.use('/resultados', resultadosRouter);

app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;