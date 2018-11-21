import React from 'react';
import PropTypes from 'prop-types';
import Error from '../error/Error';
import Loader from '../loader/Loader';

const LoadingComponent = ({ isLoading, error, pastDelay }) => {
  if (isLoading && pastDelay) {
    return <Loader />;
  }
  if (error) {
    return <Error>Error!!!</Error>;
  }
  return null;
};
LoadingComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  pastDelay: PropTypes.bool.isRequired,
  error: PropTypes.bool,
};

export default LoadingComponent;
