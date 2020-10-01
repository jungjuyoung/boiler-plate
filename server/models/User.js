const mongoose = require('mongoose');
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

//userSchema.pre()는 mongoose에서 가져온 메소드
// save기능을 하기 전에 무언가를 한다는것.
userSchema.pre('save', function (next) {
  next;
});
const User = mongoose.model('User', userSchema);
module.exports = { User };
