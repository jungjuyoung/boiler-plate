import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (e) => {
    console.log(`e: ${e.currentTarget.value}`);
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(`Email: ${Email}`);
    console.log(`Password: ${Password}`);

    const body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((res) => {
      console.log(`dispatch res: ${JSON.stringify(res.payload)}`);
      if (res.payload.loginSuccess) {
        props.history.push('/');
      } else {
        alert('Error!!!');
      }
    });
    // 원래는 여기서 axios.post('/api/users/login', body).then(res)로
    // 서버에 전달해야 하는데 리덕스를 사용하기때문에 dispatch로 대체
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
