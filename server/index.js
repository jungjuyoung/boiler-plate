const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const config = require('./config/key');
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');
const cookieParser = require('cookie-parser');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// 최상위 라우터
app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

// 회원가입 라우터
app.post('/api/users/register', (req, res) => {
  // 회원가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 DB에 넣어준다
  // req.body안에는 json형식으로 bodyParser를 이용해서 client에서 보낸정보가 들어있다.
  // User모델에 req.body를 넣어준다.
  const user = new User(req.body);

  // user.save는 몽고DB에서 가져온 메소드. user.save하면 User모델에 client에서 보낸정보(req.body)가 저장된다.
  // 그런데 비밀번호같은 경우 관리자도 볼수없게 bcrypt를 이용해 암호화한다. 비밀번호 암호화하기 -> User모델
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

// 로그인 라우터
app.post('/api/users/login', (req, res) => {
  // 요청된 이메일이 DB에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인
    // comparePassword란 메소드를 만들어서 User모델에도 같은 이름의 comparePassword메소드를 만들어 확인한다.
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      // console.log(`userInfo: ${userInfo}`);
      // 매치되는게 없다면
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      // 매치되는게 있다면, 비밀번호까지 맞다면 그 User를 위한 token을 생성
      userInfo.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 저장한다. 어디에? 토큰은 여러군데 저장가능. cookie or 로컬스토리지 or 세션스토리지
        // 이번에는 cookie에 저장
        // 클라이언트 쿠키에 "x_auth"란 이름에 user.token값 저장
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// auth 인증처리하는 라우트
// role 0 이면 일반유저, 0 이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// 로그아웃 라우터
app.get('/api/users/logout', auth, (req, res) => {
  //
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
