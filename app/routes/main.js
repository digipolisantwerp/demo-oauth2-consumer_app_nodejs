'use strict';

var express = require('express');
var crtlMain = require('../controllers/authorization_code');

module.exports = function addRoutes(app) {

  var router = express.Router();

  router.route('/')
      .all(crtlMain.index);

  router.route('/callback/aprofiel')
      .all(crtlMain.callbackAprofiel);

  // Register our routes
  app.use('/', router);
};
