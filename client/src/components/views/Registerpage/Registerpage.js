import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function Registerpage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = (e) => {
    console.log(`e: ${e.currentTarget.value}`);
    setEmail(e.currentTarget.value);
  };
  const onNameHandlerHandler = (e) => {
    console.log(`e: ${e.currentTarget.value}`);
    setName(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    console.log(`e: ${e.currentTarget.value}`);
    setPassword(e.currentTarget.value);
  };
  const onConfirmPasswordHandler = (e) => {
    console.log(`e: ${e.currentTarget.value}`);
    setConfirmPassword(e.currentTarget.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(`Email: ${Email}`);
    console.log(`Password: ${Password}`);

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
    }

    const body = {
      email: Email,
      name: Name,
      password: Password,
      confirmPassword: ConfirmPassword,
    };

    dispatch(registerUser(body)).then((res) => {
      console.log(`dispatch res: ${JSON.stringify(res.payload)}`);
      if (res.payload.success) {
        props.history.push('/login');
      } else {
        alert('Failed to sign up!!!');
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
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandlerHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />

        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Registerpage;
