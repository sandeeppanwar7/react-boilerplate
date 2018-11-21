'use strict';
const express = require('express');
const router = express.Router();
const siteConfig = require('./../../common/'+process.env.SITE);
const SSO = siteConfig.sso;

router.get('/test', (req, res) => {
  res.json({test:'test'});
});

module.exports = router;
