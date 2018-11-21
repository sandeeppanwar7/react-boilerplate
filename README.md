$ cp ./server/_env ./server/.env
$ npm install
$ npm start

## Features

- ES2015/16 with [Babel](https://github.com/babel/babel)
- Universal rendering with support for data fetching *and code splitting*.
- Hot reloading on both client and *server*
- Locally scoped CSS with [CSS modules](https://github.com/css-modules)
- Development and release builds with [Webpack 2](https://github.com/webpack/webpack)
- State management with [Redux](https://github.com/reactjs/redux)


## Commands

### `npm start`

Serves the app in development mode

> NOTE: This is simply an alias for `npm run serve`.

### `npm run prod:build`

Builds the app ready for release

### `npm run prod:serve`
### (`WEBPACK_DEV_SERVER=false npm run serve`)

Serves the app in release mode

> NOTE: Requires you to first build the app with `npm run prod:build`.

## Environment Variables

Environment variables are defined via Unix env vars and are documented in the [`./server/_env`](server/_env) file.

To avoid the hassle of having to define env vars on your local machine during development we recommend you simply rename the [`./server/_env`](server/_env) file to `./server/.env` which, in the absence of a predefined `NODE_ENV`, will be copied to your environment.

> NOTE: Any of the environment variables can be made available to the client by explicitly declaring them in the root [Html](src/containers/html/Html.js) component. This extra step is required to prevent accidentally leaking sensitive data to the client.
