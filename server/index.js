const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const { User } = require('./models/User')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')
const config = require('./config/key')

// application/x-www-form-urlendcoded
app.use(express.urlencoded({ extended: true }))
// application/json
app.use(express.json())
app.use(cookieParser())

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongDB Connected...'))
	.catch((err) => console.log(err))

app.get('/', (req, res) => {
	res.send('Hello World!!!')
})
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/api/users/register', (req, res) => {
	// 회원가입할때 필요한 정보들을 client에서 가져오면
	// 비밀번호는 암호화 해서
	// 그것들을 데이터베이스에 넣어준다.
	const user = new User(req.body)
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({
			success: true,
		})
	})
})

app.post('/api/users/login', (req, res) => {
	// 요청된 이메일이 데이터베이스에 있는지 찾는다.
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user)
			return res.json({
				loginSuccess: false,
				message: '유효하지 않은 이메일 입니다.',
			})

		// 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
		user.comparePassword(req.body.password, (err, isMatch) => {
			console.log(
				`user.compaerPassword req.body.password: ${req.body
					.password}, isMatch: ${isMatch}`
			)

			if (!isMatch)
				return res.json({ loginSuccess: false, message: 'Wrong password' })

			// 비밀번호까지 맞다면 토큰을 생성해서 부여함.
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err)
				// 토큰을 저장한다. 어디에? 쿠키 or 로컬스토리지 or 세션스토리지... 일단은 쿠키에
				// res.cookie('x_authExp', user.tokenExp);
				res.cookie('x_auth', user.token).status(200).json({
					loginSuccess: true,
					userId: user._id,
				})
			})
		})
	})
})

// role 0이면 일반유저, 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
	// 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 것.
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	})
})

app.get('/api/users/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).send({ success: true })
	})
})

app.get('/api/hello', (req, res) => {
	res.send('HI~~~')
})
