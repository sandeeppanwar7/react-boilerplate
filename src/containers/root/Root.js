import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { CookiesProvider } from 'react-cookie';
import routes from '../../routes';

function Root({ store, history }) {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    </CookiesProvider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
