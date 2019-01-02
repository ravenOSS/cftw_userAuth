var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var User = require('../models/user');

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
  } else {
    req.flash('danger', 'Please login');
  //  res.redirect('/login');
  }
  res.redirect('/login');
}

/* GET frontpage. */
router.get('/', function (req, res, next) {
  res.render('frontpage', { title: 'Your Bank', strapline: 'A place to Stash Your Cash' });
});

/* GET registration page */
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Account Application', message: req.flash('registerMessage') });
});

/* POST registration */
router.post('/register',
  passport.authenticate('local-register', {
    successRedirect: '/users',
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
    { successRedirect: '/users',
      failureRedirect: '/login',
      failureFlash: true })
);

/* GET dashboard */
router.get('/dashboard', ensureAuthenticated, function (req, res) {
  res.render('dashboard', { title: 'Your Dashboard', user: 'currentUser' });
});

/* GET logout */
router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

/* render datatable page. */
router.get('/table', ensureAuthenticated, function (req, res, next) {
  res.render('userdetail', { title: 'dataTable' });
});

/* This is the api route to get the datatable ajax data */
router.get('/usertable', function (req, res, next) {
  User.find()
    .sort({ createdAt: 'descending' })
    .exec(function (err, users) {
      if (err) { return next(err); }
      console.log(users);
      res.json(users);
    });
});

/* GET users listing. */
router.get('/users', ensureAuthenticated, function (req, res, next) {
  User.find()
    .sort({ createdAt: 'descending' })
    .exec(function (err, users) {
      if (err) { return next(err); }
      res.render('userlist', { title: 'Our Customers', users: users });
    });
});

router.get('/users/:username', function (req, res, next) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render('profile', { title: 'Edit your profile', user: user });
  });
});

router.get('/edit', ensureAuthenticated, function (req, res) {
  res.render('edit', { title: 'About You' });
});

router.post('/edit', ensureAuthenticated, function (req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.save(function (err) {
    if (err) {
      next(err);
      return;
    }
    req.flash('info', 'Profile updated!');
    res.redirect('/users');
  });
});

module.exports = router;
