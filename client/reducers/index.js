import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import publicReducer from './public_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
  public: publicReducer,
  auth: authReducer,
  user: userReducer
});

export default rootReducer;
