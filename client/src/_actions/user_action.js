import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';

export function loginUser(dataToSubmit) {
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then((res) => res.data);
  // return으로 리듀서에 현재 state와 액션을 전달
  return { type: LOGIN_USER, payload: request };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post('/api/users/register', dataToSubmit)
    .then((res) => res.data);
  // return으로 리듀서에 현재 state와 액션을 전달
  return { type: REGISTER_USER, payload: request };
}

export function auth() {
  const request = axios.get('/api/users/auth').then((res) => res.data);
  // return으로 리듀서에 현재 state와 액션을 전달
  return { type: AUTH_USER, payload: request };
}
