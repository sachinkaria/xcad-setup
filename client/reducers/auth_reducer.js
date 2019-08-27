import { AUTH_USER, UNAUTH_USER } from '../actions/auth/types';

const INITIAL_STATE = { error: null, message: '', authenticated: false };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, error: '', message: '', authenticated: true };
    case UNAUTH_USER:
      return { ...state, authenticated: false };
    default:
      break;
  }
  return state;
}
