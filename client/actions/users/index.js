import axios from 'axios';
import { browserHistory } from 'react-router';
import { UPDATE_USER, GET_INSTAGRAM_FEED } from '../types';
import { errorHandler, successHandler, processingFileUpload, completedFileUpload } from '../public';

export function updateUser(user, url, showSuccess) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    axios.put('/api/users', user, AUTH_HEADERS)
      .then((response) => {
        dispatch({ type: UPDATE_USER, payload: response.data });
        if (showSuccess) successHandler(dispatch, 'Your changes have been successfully saved.');
        if (url) browserHistory.push(url);
      })
      .catch((error) => {
        errorHandler(dispatch, error.response);
      });
  };
}

export function uploadPhoto(file, type) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    dispatch(processingFileUpload());
    axios.post(`/api/users/photos/${type}`, file, AUTH_HEADERS)
      .then((response) => {
        dispatch({ type: UPDATE_USER, payload: response.data });
        dispatch(completedFileUpload());
        // browserHistory.push(url);
      })
      .catch(() => {
        errorHandler(dispatch, 'There was a problem saving your image. Please try again.');
        dispatch(completedFileUpload());
      });
  };
}

export function uploadMultiplePhotos(files) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    dispatch(processingFileUpload());
    axios.all(files.map(file => axios.post('/api/users/photos', file, AUTH_HEADERS)))
      .then(() => {
        dispatch(completedFileUpload());
        dispatch(getCurrentUser());
        // browserHistory.push(url);
      })
      .catch(() => {
        errorHandler(dispatch, 'There was a problem saving your image. Please try again.');
        dispatch(completedFileUpload());
      });
  };
}

export function deletePhoto(type) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    axios.delete(`/api/users/photo/${type}`, AUTH_HEADERS)
      .then((response) => {
        dispatch({ type: UPDATE_USER, payload: response.data });
        // browserHistory.push(url);
      })
      .catch(() => {
        errorHandler(dispatch, 'There was a deleting your image. Please try again.');
      });
  };
}

export function deleteMultiple(id) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    axios.delete(`/api/users/photos/${id}`, AUTH_HEADERS)
      .then((response) => {
        dispatch({ type: UPDATE_USER, payload: response.data });
        // browserHistory.push(url);
      })
      .catch(() => {
        errorHandler(dispatch, 'There was a deleting your image. Please try again.');
      });
  };
}


export function getCurrentUser() {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    axios.get('/api/users/me', AUTH_HEADERS)
      .then((response) => {
        dispatch({ type: UPDATE_USER, payload: response.data });
      })
      .catch(() => {
        errorHandler(dispatch, 'Sorry there is a problem getting your account details. Please sign in and try again.');
      });
  };
}

export function updatePassword(password, showSuccess) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    axios.put('/api/users/password', password, AUTH_HEADERS)
      .then(() => {
        if (showSuccess) successHandler(dispatch, 'Your password has been updated.');
      })
      .catch(() => {
        errorHandler(dispatch, 'There was a problem changing your password. Please try again.');
      });
  };
}

export function authenticateInstagram(code) {
  const AUTH_HEADERS = { headers: { Authorization: localStorage.getItem('token') } };
  return function (dispatch) {
    axios.get(`/api/users/me/instagram/handleAuth?code=${code}`, AUTH_HEADERS)
      .then((response) => {
        dispatch({ type: UPDATE_USER, payload: response.data });
        browserHistory.push('/dashboard/profile/photos');
      })
      .catch(() => {
        errorHandler(dispatch, 'There was a problem authenticating your instagram account.');
      });
  };
}

export function getInstagramFeed(code) {
 return function (dispatch) {
  axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${code}`)
    .then((response) => {
      dispatch({ type: GET_INSTAGRAM_FEED, payload: response.data.data });
    })
    .catch(() => {
      errorHandler(dispatch, 'There was a problem getting your instagram feed.');
    });
 }
}
