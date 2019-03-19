import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import 'babel-polyfill';
import { Router, browserHistory } from 'react-router';
import reducers from './reducers/index';
import routes from './config/routes';


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.token;

if (token) {
}

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={function(){window.scrollTo(0, 0)}} history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app'));

