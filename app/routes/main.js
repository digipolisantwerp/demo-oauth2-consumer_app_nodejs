'use strict';

var express = require('express');
var crtlAProfiel = require('../controllers/authorization_code-aprofiel');
var crtlMProfiel = require('../controllers/authorization_code-mprofiel');

module.exports = function addRoutes(app) {

  var router = express.Router();

  router.route('/')
      .all(crtlAProfiel.index);

  router.route('/callback/aprofiel')
      .all(crtlAProfiel.callbackAprofiel);
      
  router.route('/callback/mprofiel')
      .all(crtlMProfiel.callbackMprofiel);

  // Register our routes
  app.use('/', router);
};
