var express = require('express');
var router = express.Router();

/* GET frontpage. */
router.get('/', function (req, res, next) {
  res.render('frontpage', { title: 'cftw Auth' });
});

/*  GET login page */
router.get('/login', function (req, res) {
  res.render('login', { title: 'Login Page' });
});

/* GET dashboard */
router.get('/dashboard', function (req, res) {
  res.render('dashboard', { title: 'Dashboard' });
});

/* GET register page */
router.get('/register', function (req, res) {
  res.render('register', { title: 'Registration Page' })
});

module.exports = router;
