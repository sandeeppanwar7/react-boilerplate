import React from 'react';
import { compose } from 'redux';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { flushWebpackRequireWeakIds } from 'react-loadable';
import fs from 'fs';
import { CookiesProvider } from 'react-cookie';
import configureStore from './store/configureStore';
import routes, { NotFoundComponent } from './routes';
import Html from './containers/html/Html';

const errorHTML = `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html >
   <head >
      <meta content="NOINDEX, NOFOLLOW" name="ROBOTS">
      <meta name="viewport" content="width=device-width, height=device-height,initial-scale=1.0,user-scalable=no">
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
      <meta http-equiv="content-language" content="en">
      <title>Page not found  | Navbharat Times</title>
      <meta name="description" content="Page not found">
      <link rel='stylesheet' type='text/css' href='/css/main.css'/>
   </head>
   <body>
        <header lang="">
          <div data-gtm-event="logo_click" class="np-logo" style="margin-left:15px;">
              <a href="/"><img src="https://opt.toiimg.com/recuperator/img/nbt/m-60120174/Hindi-News.jpg" alt="Hindi News" title=""></a>
          </div>        
        </header>
        <div id="c_wdt_articleshow_1" class="error-article-section">
          <div class="error-wrapper">
            <span class="heading-text">Sorry, page not found</span>
            <div class="sub-heading">
              It may have expired, or there could be a typo. 
              Maybe you can find what you need on our homepage.
            </div>
            <a class="return-btn" href="/">RETURN</a>
          </div>
        </div>
   </body>
</html>
`;

function logError(ex) {
  const today = new Date();
  const todayString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  fs.appendFileSync(`/var/log/node/lang-error-${todayString}.log`, ex.stack);
}

function parseCookie(cookie) {
  if (typeof cookie !== 'undefined' && cookie !== '') {
    const cookieArr = cookie.split(';');
    const cookieFinalArr = {};
    for (let i = 0; i < cookieArr.lenght; i++) {
      const c = cookieArr[i];
      const temp = c.split('=');
      if (typeof temp[0] !== 'undefined' && typeof temp[1] !== 'undefined') {
        cookieFinalArr[temp[0].trim()] = temp[1].trim();
      }
    }
    return cookieFinalArr;
  }
  return [];
}

function flatten(arr) {
  return [].concat(...arr);
}

function uniq(arr) {
  return [...new Set(arr)];
}

function isTruthy(val) {
  return !!val;
}

const flattenUniq = compose(
  uniq,
  flatten,
);

function fetchComponentData(renderProps, store) {
  const requests = renderProps.components.filter(isTruthy).map(component => {
    // Handle `connect`ed components.
    if (component.WrappedComponent) {
      component = component.WrappedComponent;
    }

    if (component.fetchData) {
      const { params, history } = renderProps;
      let { query } = renderProps;
      if (!query) {
        query = Object.assign({}, renderProps.location.query);
      }

      return (
        component
          .fetchData({
            dispatch: store.dispatch,
            query,
            params,
            history,
          })
          // Make sure promise always successfully resolves
          .catch(() => {})
      );
    }
    return null;
  });

  return Promise.all(requests);
}

function isNotFound(renderProps) {
  return !renderProps || renderProps.components.some(component => component === NotFoundComponent);
}

function getJsByChunkName(name, { assetsByChunkName }) {
  let assets = assetsByChunkName[name];
  if (!Array.isArray(assets)) {
    assets = [assets];
  }
  return assets.find(asset => /\.js$/.test(asset));
}

function getJsByModuleIds(moduleIds, { modulesById, chunksById }) {
  const chunkIds = flatten(
    moduleIds.map(id => {
      const clientModule = modulesById[id];
      if (!clientModule) {
        throw new Error(`${id} not found in client stats`);
      }
      return clientModule.chunks;
    }),
  );
  return flattenUniq(
    chunkIds.map(id => {
      return chunksById[id].files
        .filter(file => /\.js$/.test(file))
        .filter(file => !/\.hot-update\.js$/.test(file));
    }),
  );
}

function getCssByChunkName(name, { assetsByChunkName }) {
  let assets = assetsByChunkName[name];
  if (!Array.isArray(assets)) {
    assets = [assets];
  }
  return assets.find(asset => /\.css$/.test(asset));
}

function getJs(moduleIds, stats) {
  return [
    getJsByChunkName('bootstrap', stats),
    ...getJsByModuleIds(moduleIds, stats),
    getJsByChunkName('client', stats),
  ].filter(isTruthy);
}

function getCss(stats) {
  return [getCssByChunkName('client', stats)].filter(isTruthy);
}

function render(renderProps, store, stats, res, req) {
  const markup = renderToString(
    <CookiesProvider cookies={req.universalCookies}>
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    </CookiesProvider>,
  );

  const head = Helmet.rewind();
  const moduleIds = flushWebpackRequireWeakIds();
  const js = getJs(moduleIds, stats);

  const httpPushCache = [];
  const css = getCss(stats);

  const httpCache = httpPushCache.join(', ');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Link', httpCache);
  }

  const initialState = store.getState();
  const version = stats.version;

  return renderToStaticMarkup(
    <Html
      js={js}
      css={css}
      html={markup}
      head={head}
      initialState={initialState}
      version={version}
      isOperaMini={stats.isOperaMini}
    />,
  );
}

/**
 * Express middleware to render HTML using react-router
 * @param  {object}     stats Webpack stats output
 * @return {function}   middleware function
 */
export default ({ clientStats }) => {
  // Build stats maps for quicker lookups.
  const modulesById = clientStats.modules.reduce((modules, mod) => {
    modules[mod.id] = mod;
    return modules;
  }, {});
  const chunksById = clientStats.chunks.reduce((chunks, chunk) => {
    chunks[chunk.id] = chunk;
    return chunks;
  }, {});
  const assetsByChunkName = clientStats.assetsByChunkName;

  /**
   * @param  {object}     req Express request object
   * @param  {object}     res Express response object
   * @return {undefined}  undefined
   */
  return (req, res, next) => {
    // console.log(process.env.API_MASTER_FEED);
    fetch(process.env.API_MASTER_FEED)
      .then(r => r.json())
      .then(data => {
        const initialState = { app: data };
        const url = req.url;
        const memoryHistory = createMemoryHistory(url);
        const store = configureStore(initialState);
        const history = syncHistoryWithStore(memoryHistory, store);
        const cookie = parseCookie(req.headers.cookie);

        match(
          {
            history,
            routes,
            location: url,
          },
          (error, redirectLocation, renderProps) => {
            if (error) {
              res.status(500).send(error.message);
            } else if (redirectLocation) {
              res.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
            } else {
              fetchComponentData(renderProps, store).then(() => {
                let html;
                try {
                  html = render(
                    renderProps,
                    store,
                    {
                      modulesById,
                      chunksById,
                      assetsByChunkName,
                      cookie,
                      version: clientStats.hash,
                    },
                    res,
                    req,
                  );
                } catch (ex) {
                  if (process.env.NODE_ENV !== 'development') {
                    logError(ex);
                    res.status(500).send(errorHTML);
                  } else {
                    return next(ex);
                  }
                }

                res.status(isNotFound(renderProps) ? 404 : 200).send(`<!doctype html>${html}`);
                return null;
              });
            }
          },
        );
      });
  };
};
