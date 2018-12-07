var dotenv = require('dotenv').config();
var createError = require('http-errors');
require('./config/db');
var express = require('express');
var flash = require('connect-flash'); // !!!
var logger = require('morgan');
var path = require('path');
var passport = require('passport'); // !!!
var session = require('express-session'); // !!!

var routes = require('./routes/routes'); // !!!

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(session({
  secret: 'a top secret secret',
  cookie: { secure: false, maxAge: null },
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize()); // !!!
app.use(passport.session()); // !!!

app.use(routes); // !!!

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
