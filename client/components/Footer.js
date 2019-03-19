import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <Row className="gc-section gc-section--footer text-center">
      <Col sm={8} smOffset={2}>
        <Row>
          <Col className="text-center">
            <p className="gc-text gc-white">
              &copy; Fullstack Boilerplate. All rights reserved.
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
