import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * Blocks the rendering of a component given a matched <route> if the user is not logged in
 * and redirects the user to LoginForm
 *
 * @param {*} param0
 */
const PrivateRoute = ({
  component: Component,
  auth,
  componentProps,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return auth.isAuthenticated === true ? (
          <Component {...routeProps} {...componentProps} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
