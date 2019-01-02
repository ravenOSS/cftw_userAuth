var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// ===============local login====================================
passport.use('local-login', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// ===============local register=================================
passport.use('local-register', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',

  passReqToCallback: true
},
function (req, username, password, done) {
  process.nextTick(function () {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        console.log('user already exists');
        return done(null, false, { message: 'User already registered' });
      } else {
        var newUser = new User();
        newUser.username = req.body.username;
        newUser.password = newUser.generateHash(password);
        newUser.email = req.body.email;
        newUser.save(function (err) {
          if (err) {
            console.log(err);
            throw err;
          } else {
            console.log(newUser);
            return done(null, newUser);
          }
        });
      }
    });
  });
}));

module.exports = passport;
