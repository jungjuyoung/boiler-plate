import React from 'react';
import axios from 'axios';
function LandingPage(props) {
  const onClickHandler = (e) => {
    axios.get('/api/users/logout').then((res) => {
      console.log(res.data);
      if (res.data.success) {
        props.history.push('/login');
      } else {
        alert('failed logout...');
      }
    });
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h1>시작 페이지</h1>
      <button onClick={onClickHandler}>Logout</button>
    </div>
  );
}

export default LandingPage;
