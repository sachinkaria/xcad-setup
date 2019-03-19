import axios from 'axios';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, UPDATE_USER } from '../types';
import { errorHandler, successHandler } from '../public';
import { getCurrentUser } from '../users';
import { createEvent } from '../events';

export function loginUser({ email, password }) {
  return (dispatch) => {
    axios.post('/api/users/login', { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch({ type: AUTH_USER });
        dispatch({ type: UPDATE_USER, payload: response.data.user });
        getCurrentUser();

        heap.identify(response.data.user.email);
        if (sessionStorage.getItem('initialRoute')){
          browserHistory.push(sessionStorage.getItem('initialRoute'));
        } else
          browserHistory.push('/');
      })
      .catch(() => {
        const ERROR = 'Sorry the email or password was incorrect. Please try again.';
        errorHandler(dispatch, ERROR);
      });
  };
}

export function registerUser({ firstName, lastName, email, mobileNumber, password }) {
  return (dispatch) => {
    axios.post('/api/users/create', { firstName, lastName, email, mobileNumber, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch({ type: AUTH_USER });
        dispatch({ type: UPDATE_USER, payload: response.data.user });
        const EVENT = JSON.parse(sessionStorage.getItem('eventDetails'));
        dispatch(createEvent(EVENT, '/dashboard/events'));
      })
      .catch((error) => {
        errorHandler(dispatch, 'There was a problem signing up. Please try again.');
      });
  };
}

export function registerChef({ email, password }) {
  return (dispatch) => {
    axios.post('/api/chefs/create', { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch({ type: UPDATE_USER, payload: response.data.user });
        dispatch({ type: AUTH_USER });
        browserHistory.push('/setup/personal');
      })
      .catch((error) => {
        errorHandler(dispatch, 'There was a problem signing up. Please try again.');
      });
  };
}

export function forgotPassword({ email }) {
  return (dispatch) => {
    axios.post('/api/forgot', { email })
      .then((response) => {
        successHandler(dispatch, 'An email has been sent to your address. Please follow the link from there.');
        browserHistory.push('/');
      })
      .catch((error) => {
        errorHandler(dispatch, 'This email does not exist. Please enter a valid email address.');
      });
  };
}

export function resetPassword({ password }, token) {
  return (dispatch) => {
    axios.post(`/api/reset/${token}`, { password })
      .then((response) => {
        successHandler(dispatch, 'Your password has been successfully saved. Please login to continue.');
        browserHistory.push('/login');
      })
      .catch((error) => {
        errorHandler(dispatch, 'There was an error resetting your password. Please try again.');
      });
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch({ type: UNAUTH_USER });
    dispatch({ type: UPDATE_USER, payload: null });
    delete localStorage.token;
    delete localStorage.user;
    browserHistory.push('/');
  };
}