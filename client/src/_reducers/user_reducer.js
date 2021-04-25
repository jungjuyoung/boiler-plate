import { LOGIN_USER } from '../_actions/types';

const user = function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;
    default:
      return state;
      break;
  }
};

export default user;
