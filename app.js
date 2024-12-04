const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');

dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


const uri = process.env.MONGO_URI; 

const startServer = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    app.listen(3000, () => console.log('Servidor iniciado en http://localhost:3000'));
  } catch (error) {
    console.error('No se pudo conectar a MongoDB:', error);
  }
};

startServer();

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
