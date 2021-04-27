import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function authHoc(SpecificComponent, option, adminRoute = null) {
  // SpecificComponent =  auth에 넣을 컴포넌트
  // option = null: 아무나 출입 가능, true: 로그인 한 유저만 출입 가능, false: 로그인 한 유저는 출입 불가능

  function AuthenticationsCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((res) => {
        console.log(res);

        // 로그인 하지 않은 상태
        if (!res.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          }
        } else {
          // 로그인 한 상태
          if (adminRoute && !res.payload.isAdmin) {
            props.history.push('/');
          } else {
            if (option === false) {
              props.history.push('/');
            }
          }
        }
      });
      //   axios.get('/api/users/auth');
    }, [dispatch]);

    return <SpecificComponent />;
  }

  return AuthenticationsCheck;
}
