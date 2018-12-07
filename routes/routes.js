var express = require('express');
var router = express.Router();
var passport = require('../config/strategy');

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

/* route middleware to make sure a user is logged in */
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/* GET frontpage. */
router.get('/', function (req, res, next) {
  res.render('frontpage', { title: 'cftw Auth' });
});

/* GET registration page */
router.get('/register', function (req, res, next) {
  res.render('register2', { title: 'Registration Page', message: req.flash('registerMessage') });
});

/* POST registration */
router.post('/register',
  passport.authenticate('local-register', {
    successRedirect: '/dashboard',
    successFlash: true,
    failureRedirect: '/register',
    failureFlash: true })
);

/*  GET login page */
router.get('/login', function (req, res) {
  res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
});

/* Authenticate the login */
router.post('/login',
  passport.authenticate('local-login',
    { successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true })
);

/* GET dashboard */
router.get('/dashboard', ensureAuthenticated, function (req, res) {
  res.render('dashboard', { title: 'Dashboard', user: 'currentUser' });
});

/* GET logout */
router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
