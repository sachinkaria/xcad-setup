import axios from 'axios';
import { LIST_CHEFS, GET_CHEF, SHOW_ERROR, HIDE_ERROR, SHOW_SUCCESS, HIDE_SUCCESS, PROCESSING_FILE_UPLOAD, COMPLETED_FILE_UPLOAD } from '../types';

export function errorHandler(dispatch, error) {
  if (error) {
    dispatch({
      type: SHOW_ERROR,
      payload: error
    });

    setTimeout(() => {
      dispatch({
        type: HIDE_ERROR,
        payload: null
      });
    }, 5000);
  }
}

export function successHandler(dispatch, message) {
  if (message) {
    dispatch({
      type: SHOW_SUCCESS,
      payload: message
    });

    setTimeout(() => {
      dispatch({
        type: HIDE_SUCCESS,
        payload: null
      });
    }, 5000);
  }
}

export function listChefs() {
  return function (dispatch) {
    axios.get('/api/chefs')
      .then((response) => {
        dispatch({
          type: LIST_CHEFS,
          payload: response.data
        });
      })
      .catch((err) => {
        errorHandler(dispatch, 'There was a problem. Please refresh and try again.');
      });
  };
}

export function getChef(id) {
  return function (dispatch) {
    axios.get(`/api/chefs/${id}`)
      .then((response) => {
        dispatch({
          type: GET_CHEF,
          payload: response.data
        });
      })
      .catch((err) => {
        errorHandler(dispatch, 'There was a problem. Please refresh and try again.');
      });
  };
}

export function processingFileUpload() {
  return ({ type: PROCESSING_FILE_UPLOAD });
}

export function completedFileUpload() {
  return ({ type: COMPLETED_FILE_UPLOAD });
}
