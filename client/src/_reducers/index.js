import { combineReducers } from 'redux';
import user from './user_reducer';
// import register from './register_reducer';
// import comment from './comment_reducer';

const rootReducer = combineReducers({
  user,
  // register,
  // comment
});
export default rootReducer;
