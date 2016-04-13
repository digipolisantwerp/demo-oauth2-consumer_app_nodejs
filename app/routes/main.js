'use strict';

var express = require('express');
var crtlProfiel = require('../controllers/authorization_code-profielen');

module.exports = function addRoutes(app) {

  var router = express.Router();

  router.route('/')
      .all(crtlProfiel.index);

  router.route('/callback/aprofiel')
      .all(crtlProfiel.callbackAprofiel);
      
  router.route('/callback/mprofiel')
      .all(crtlProfiel.callbackMprofiel);

  // Register our routes
  app.use('/', router);
};
