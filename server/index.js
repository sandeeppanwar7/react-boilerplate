'use strict';

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const colors = require('colors/safe');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const debug = require('debug')('app');
const api = require('./routes/api');
const app = express();
const morgan = require('morgan');
const cookiesMiddleware = require('universal-cookie-express');

if(!process.env.NODE_ENV){
  throw new Error(
    colors.red(
      `Please specify NODE_ENV (development|production)`
    )
  );  
}

var site = process.env.SITE?process.env.SITE:'nbt';
var envi = process.env.SITE?process.env.NODE_ENV:'production';

const DOT_ENV_PATH = path.join(__dirname, "env/"+site+'.'+envi+'.env');
const UNDER_ENV_PATH = path.join(__dirname, "env/"+'_env');

// The absence of a NODE_ENV suggests we are running locally
// and not in a deployed environment so we load the local .env file.
try {
  fs.statSync(DOT_ENV_PATH);
  dotenv.load({
    path: DOT_ENV_PATH
  });
  // Require 'debug' after env has been setup to ensure it takes into
  // account `process.env.DEBUG`.
  require('debug')('app')(
    colors.yellow(`Using environment variables from ${process.env.NODE_ENV}.env`)
  );
} catch (e) {
  throw new Error(
    colors.red(
      `${DOT_ENV_PATH} does not exist.
          Try renaming the '_env' file.`
    )
  );
}

// `./_env` is considered a definitive list of required environment variables
const missingVars = Object.keys(
  dotenv.parse(fs.readFileSync(UNDER_ENV_PATH))
).filter(key => !process.env[key]);

if (missingVars.length) {
  throw new Error(
    colors.red(
      `Missing required environment variable(s): ${missingVars.join(', ')}`
    )
  );
}

if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}



if (process.env.NODE_ENV !== 'development') {
  var accessLogStream = fs.createWriteStream('/var/log/node/lang-access.log', {flags: 'a'});
  app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":response-time"`, {stream: accessLogStream}));  

  process.on('uncaughtException', function (err) {
      if (err) {
        fs.appendFileSync('/var/log/node/lang-error.log', "caughtException but no error msg " + err.stack);
      }
  });
  process.on('unhandledRejection', function (err) {
      if (err) {
        fs.appendFileSync('/var/log/node/lang-error.log', "caughtException but no error msg " + err.stack);
        //process.exit(1);
      }
  });  
}

//Don't set tags
app.set('etag', false);

if(process.env.PORT){
  app.set('port', process.env.PORT);  
} else {
  app.set('port', 3003);  
}


app.enable('trust proxy');


app.use(function (req, res, next) {
  var seconds = 6 * 30 * 24 * 60 * 60;//for 6 months now
  if (req.url.match(/^\/(img|icons|fonts|css)\/.+/)) {
      res.setHeader('cache-control', 'public, max-age=' + seconds);
      res.setHeader("expires", new Date(Date.now() + seconds * 1000).toUTCString());
  }
  next();
});

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookiesMiddleware());

app.use('/api', api);

app.get('/healthcheck', (req, res) => {
	res.end("ok");
});


if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'stg1' && process.env.NODE_ENV != 'stg2') {
  app.use(require('./routes/webpack'));
} else {
  app.use(require('./routes/static'));
}

if (process.env.NODE_ENV === 'development') {
  const errorhandler = require('errorhandler');
  errorhandler.title = '¯\\_(ツ)_/¯';
  app.use(errorhandler());
}
let server = app.listen(app.get('port'), (err) => {
  debug(colors.white(`Server ${process.env.NODE_ENV} started: http://localhost:${process.env.PORT}`));
  debug(colors.grey("Press 'ctrl + c' to terminate server"));
});
