'use strict';

var request = require('request');
var querystring = require('querystring');
var yamlConfig = require('node-yaml-config');
var OAuth2 = require('oauth').OAuth2;


function getConfig() {
  var config = yamlConfig.load(global.__base + '/config/services.yml');
  return config;
}


function createAuthorizeUrl(type) {
  var envConfig = getConfig();
  var configOauth = envConfig[type].auth;

  var url = envConfig.consent.uri.scheme + '://' + envConfig.consent.uri.domain + envConfig.consent.uri.path;

  configOauth.lng = 'nl';
  configOauth.state = '32042809';
  delete configOauth['client_secret'];
  url += querystring.stringify(configOauth);

  return url;
}


function index(req, res) {

  res.render('index.ejs', {urlAProfiel: createAuthorizeUrl('aprofiel'), urlMProfiel: createAuthorizeUrl('mprofiel')});

}


function callbackAprofiel(req, res) {
  var envConfig = getConfig();
  var configOauth = envConfig.aprofiel.auth;
  var configApi = envConfig.aprofiel.uri;

  var oauth2 = new OAuth2(configOauth.client_id,
      configOauth.client_secret,
      configApi.scheme + '://' + configApi.domain,
      null,
      configApi.path + '/oauth2/token',
      null);

  oauth2.getOAuthAccessToken(req.query.code, {'grant_type': 'authorization_code'}
      , function handleTokenResponse(err, token) {
        console.log(token);
        if (err) {
          res.json({
            error: err
          });
        } else {
          request({
            url: configApi.scheme + '://' + configApi.domain + configApi.path + '/v1/me',
            'auth': {
              'bearer': token
            }

          }, function handleApiCall(error, response, body) {
            if (error) {
              return res.send(error);
            }
            return res.send(body);
          });

        }
      });

}

function callbackMprofiel(req, res) {
  var envConfig = getConfig();
  var configOauth = envConfig.mprofiel.auth;
  var configApi = envConfig.mprofiel.uri;

  var oauth2 = new OAuth2(configOauth.client_id,
      configOauth.client_secret,
      configApi.scheme + '://' + configApi.domain,
      null,
      configApi.path + '/oauth2/token',
      null);

  oauth2.getOAuthAccessToken(req.query.code, {'grant_type': 'authorization_code'}
      , function handleTokenResponse(err, token) {
        // console.log(token);
        if (err) {
          res.json({
            error: err
          });
        } else {
          request({
            url: configApi.scheme + '://' + configApi.domain + configApi.path + '/v1/me',
            'auth': {
              'bearer': token
            }

          }, function handleApiCall(error, response, body) {
            if (error) {
              return res.send(error);
            }
            return res.send(body);
          });

        }
      });

}

module.exports = {
  index: index,
  callbackAprofiel: callbackAprofiel,
  callbackMprofiel: callbackMprofiel
};
