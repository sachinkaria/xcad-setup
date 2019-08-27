import {
  UPDATE_USER
} from '../actions/users/types';

const INITIAL_STATE = { data: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, data: action.payload };
    default:
      break;
  }
  return state;
}
