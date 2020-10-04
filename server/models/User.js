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
    // 비밀번호를 바꾸는게 아니라 다른걸 바꿀때 user.save로 돌려보내야한다.
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567과 DB에 암호화된 비밀번호 $2bqjfj%3sbgdy를 비교
  // plainPassword 1234567를 암호화 해서 DB에 암호화된 비밀번호 $2bqjfj%3sbgdy와 비교한다.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
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

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  // user._id + '특정스트링'이 token이 된것을
  // 특정스트링을 넣어서 복호화함. 우리는 특정 스트링이 secretToken이었음
  // 토큰을 decode한다.
  jwt.verify(token, 'secretToken', function (err, decode) {
    // user._id를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};
const User = mongoose.model('User', userSchema);
module.exports = { User };
