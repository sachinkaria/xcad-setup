import { SHOW_ERROR, HIDE_ERROR, SHOW_SUCCESS, HIDE_SUCCESS } from '../actions/public/types';

const INITIAL_STATE = { chefs: [], chef: null, error: null, success: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_ERROR:
      return { ...state, error: action.payload };
    case HIDE_ERROR:
      return { ...state, error: action.payload };
    case SHOW_SUCCESS:
      return { ...state, success: action.payload };
    case HIDE_SUCCESS:
      return { ...state, success: action.payload };
    default:
      break;
  }
  return state;
}
