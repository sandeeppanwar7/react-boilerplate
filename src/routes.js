import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app/App';
import IndexLoadable from './containers/index/IndexLoadable';
import NotFound from './containers/notfound/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IndexLoadable} />
    <Route path="*" component={NotFound} />
  </Route>
);

export { NotFound as NotFoundComponent };
