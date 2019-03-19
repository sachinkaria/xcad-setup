import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

const ErrorHandler = (props) => {
  const classes = classNames('gc-alert gc-alert--error', {
    'gc-slide-down': props.error
  });
  return (
    props.error ?
      <div className={classes}>
        <p className="gc-text gc-white">
          {props.error}
        </p>
      </div> :
      null
  );
};

ErrorHandler.propTypes = {
  error: React.PropTypes.string
};

ErrorHandler.defaultProps = {
  error: null
};

function mapStateToProps(state) {
  return { error: state.public.error };
}

export default connect(mapStateToProps, null)(ErrorHandler);
