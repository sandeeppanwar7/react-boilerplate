import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

const ASSET_PATH = process.env.ASSET_PATH || '/';

const siteConfig = require(`./../../../common/${process.env.SITE}`);

function Html({ js, css, html, head, initialState, version, pagetype }) {
  return (
    <html lang="en">
      <head>
        {css.map(c => (
          <link key={c} rel="preload" as="style" href={`${ASSET_PATH}${c}`} />
        ))}
        <meta value="summary_large_image" name="twitter:card" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

        <link rel="shortcut icon" href={siteConfig.icon} />
        <meta property="fb:admins" content="556964827" />
        <meta property="fb:app_id" content="972612469457383" />
        <meta content="SSM4580016100404216113TIL" name="tpngage:name" />
        <meta
          content="g6NLtv2K4hVhEOYxiHNrYfEWb_EFvUcf3PmUBPNyo54"
          name="google-site-verification"
        />
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        <meta httpEquiv="content-language" content="en" />

        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge,chrome=1" />
        {head.title.toComponent()}
        {head.meta.toComponent()}
        <meta
          name="viewport"
          content="width=device-width, height=device-height,initial-scale=1.0,user-scalable=yes,maximum-scale=5"
        />
        <meta content="NOODP" name="robots" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta content="yes" name="apple-touch-fullscreen" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        <div
          id="root"
          className="container"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />

        {process.env.NODE_ENV === 'production' ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.process = ${serialize({
                env: {
                  BROWSER: 'true',
                  API_ENDPOINT: process.env.API_ENDPOINT,
                  API_BASEPOINT: process.env.API_BASEPOINT,
                  IMG_URL: process.env.IMG_URL,
                  WEBSITE_URL: process.env.WEBSITE_URL,
                  SITE: process.env.SITE,
                },
              })}`,
            }}
          />
        ) : (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.process = ${serialize({
                env: {
                  BROWSER: 'true',
                  REDUX_LOGGER: process.env.REDUX_LOGGER,
                  API_ENDPOINT: process.env.API_ENDPOINT,
                  API_BASEPOINT: process.env.API_BASEPOINT,
                  IMG_URL: process.env.IMG_URL,
                  WEBSITE_URL: process.env.WEBSITE_URL,
                  SITE: process.env.SITE,
                  VERSION: version,
                  PAGETYPE: pagetype,
                },
              })}`,
            }}
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.INITIAL_STATE = ${serialize(initialState)}`,
          }}
        />

        {js.map(j => (
          <script data-val={j} key={j} src={`${ASSET_PATH}${j}`} />
        ))}
      </body>
    </html>
  );
}

Html.propTypes = {
  js: PropTypes.array.isRequired,
  css: PropTypes.array.isRequired,
  html: PropTypes.string,
  head: PropTypes.object.isRequired,
  initialState: PropTypes.object.isRequired,
  version: PropTypes.string,
  pagetype: PropTypes.string,
};

export default Html;
