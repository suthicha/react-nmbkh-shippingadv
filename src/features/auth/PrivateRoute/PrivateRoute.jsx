import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { openModal } from '../../modals/modalActions';

const actions = {
    openModal
}

const PrivateRoute = ({ component, exact = false, path, authenticated, openModal }) => (
  <Route
    exact={exact}
    path={path}
    render={props => (
      authenticated ? (
        React.createElement(component, props)
      ) : (
        openModal('LoginModal')
      )
    )}
  />
);

const { object, bool, string, func } = PropTypes;

PrivateRoute.propTypes = {
  component: func.isRequired,
  exact: bool,
  path: string.isRequired,
  authenticated: bool.isRequired,
  location: object
};

export default connect(null, actions)(PrivateRoute);
