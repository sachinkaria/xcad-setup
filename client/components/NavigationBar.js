import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import ErrorHandler from '../containers/ErrorHandler';
import SuccessHandler from '../containers/SuccessHandler';
import Footer from './Footer';


class NavigationBar extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>FullStack Boilerplate</title>
          <link rel="canonical" href="https://www.fullstack-boilerplate.co" />
          <meta name="description" content="FullStack Boilerplate." />
          <meta property="og:description" content="FullStack Boilerplate." />
        </Helmet>
        <Navbar fixedTop className="gc-navbar">
          <Navbar.Header>
            <Navbar.Brand>
              Fullstack Boilerplate
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <ErrorHandler />
          <SuccessHandler />
        </Navbar>
        <div className="gc-container">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default NavigationBar
