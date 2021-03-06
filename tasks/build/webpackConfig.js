'use strict';

const createConfig = require('./createConfig');

module.exports = [
  createConfig({
    name: 'client',
    sourceMap: 'eval',
    hot: false,
    bootstrapChunk: true,
    // TODO: Remove the need for `publicPath` once the style / css loader
    // has landed a better fix for relative image references from
    // sourcemapped css.
    // https://github.com/webpack/style-loader#recommended-configuration
    // https://github.com/webpack/style-loader/issues/55
    publicPath: '/'
  }),
  createConfig({
    name: 'server',
    node: true,
    sourceMap: 'eval',
    codeSplitting: false
  })
];
