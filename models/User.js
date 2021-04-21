const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

console.log(`bcrypt: ${JSON.stringify(bcrypt)}`);
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre('save', function (next) {
  var user = this;
  // 비밀번호를 변경할 때만

  if (user.isModified('password')) {
    // 비밀전호를 암호화 한다
    console.log('password changed');
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      console.log(`salt: ${salt}, user: ${user}`);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
