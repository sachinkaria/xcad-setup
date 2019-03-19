import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

const SuccessHandler = (props) => {
  const classes = classNames('gc-alert gc-alert--success', {
    'gc-slide-down': props.success
  });
  return (
    props.success ?
      <div className={classes}>
        <p className="gc-text gc-white">
          {props.success}
        </p>
      </div> :
      null
  );
};

SuccessHandler.propTypes = {
  success: React.PropTypes.string
};

SuccessHandler.defaultProps = {
  success: null
};

function mapStateToProps(state) {
  return { success: state.public.success };
}

export default connect(mapStateToProps, null)(SuccessHandler);
