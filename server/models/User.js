const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

// 비밀번호 암호화 하기
// userSchema.pre()는 mongoose에서 가져온 메소드
// save기능을 하기 전에 무언가를 한다는것.
userSchema.pre('save', function (next) {
  let user = this;
  // 비밀번호를 바꿀때 암호화 시킨다.
  if (user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    // 비밀번호를 바꾸는게 아니라 다른걸 바꿀때
    next();
  }
});

userSchema.method.comparePassword = function (plainPassword, cb) {
  let user = this;
  // plainPassword 1234567과 DB에 암호화된 비밀번호 $2bqjfj%3sbgdy를 비교
  // plainPassword 1234567암호화 해서 DB에 암호화된 비밀번호 $2bqjfj%3sbgdy와 비교한다.
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.method.generateToken = function (cb) {
  let user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  // user._id + 'secretToken' = token생성
  let token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
