let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let passport = require('./strategy');
let uuid4 = require('uuid/v4');

let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  key: { type: String },
  account_number: { type: String, default: uuid4 }
});

// generating a hashed password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

// Note that validPassword is used in passport
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
