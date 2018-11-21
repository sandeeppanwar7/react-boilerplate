import 'babel-polyfill';
import React from 'react';
import { hydrate } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/root/Root';
import configureStore from './store/configureStore';

const store = configureStore(window.INITIAL_STATE);
const history = syncHistoryWithStore(browserHistory, store);

hydrate(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root'),
);

/* eslint-disable */
if (module.hot) {
  module.hot.accept('containers/root/Root', () => {
    const NextRoot = require('containers/root/Root').default;
    hydrate(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
/* eslint-enable */
