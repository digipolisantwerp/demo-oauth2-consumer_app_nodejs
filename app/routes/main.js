'use strict';

var express = require('express');
var crtlAProfiel = require('../controllers/authorization_code-aprofiel');

module.exports = function addRoutes(app) {

  var router = express.Router();

  router.route('/')
      .all(crtlAProfiel.index);

  router.route('/callback/aprofiel')
      .all(crtlAProfiel.callbackAprofiel);

  // Register our routes
  app.use('/', router);
};
