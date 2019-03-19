import React from 'react';
import { Route, IndexRoute } from 'react-router';
import NavigationBar from '../components/NavigationBar';
import Home from '../components/Home/';

const routes = (
  <Route path="/" component={NavigationBar}>
    <IndexRoute component={Home} />
  </Route>
);

export default routes;