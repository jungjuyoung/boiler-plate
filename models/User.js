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

userSchema.pre('save', function (next) {
  let user = this;
  // console.log('userSchema save');

  // 비밀번호를 변경할 때만
  if (user.isModified('password')) {
    // 비밀전호를 암호화 한다
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    // 비밀번호를 변경하는게 아닐때는 next로 빠져나가게 처리
    next();
  }
});

userSchema.method.comparePassword = function (plainPassword, cb) {
  console.log(`plainPassword: ${plainPassword}, cb: ${cb}`);
  // plainPassword: 1234567과 DB에 암호화된 a2dh4kfj5mf9d를 비교해야함
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.method.generateToken = function (cb) {
  let user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  // user._id 와 + 문자열'secretToken'을 더해서 = token 을 생성
  // jwt.sign에서 plainPassword를 원함 user._id.toHexString()으로 plainPassword로 만들어줌
  user.token = token;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
