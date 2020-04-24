/* eslint-disable import/no-extraneous-dependencies */
const compression = require('compression');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const indexRouter = require('./routes/index');
const generateRouter = require('./routes/generate');
const downloadRouter = require('./routes/download');

const app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use('/', indexRouter);
app.use('/start/generate', generateRouter);
app.use('/download', downloadRouter);
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://proapi.azurewebsites.net/',
    changeOrigin: true,
    pathRewrite: { '^': '' },
  }),
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
