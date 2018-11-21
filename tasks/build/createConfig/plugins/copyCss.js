'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({ revision, copyCss }) => [
  new CopyWebpackPlugin([{
    from: './public/css/main.css',
    to: revision ? 'bundle.[hash].css' : '',
    toType: 'template'
  }])
];
