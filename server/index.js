const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const config = require('./config/key');
const bodyParser = require('body-parser');
const { User } = require('./models/User');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());

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
  const user = new User(req.body);

  // user.save는 몽고DB에서 가져온 메소드. user.save하면 User모델에 client에서 보낸정보(req.body)가 저장된다.
  // 그런데 비밀번호같은 경우 관리자도 볼수없게 bcrypt를 이용해 암호화한다.
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
