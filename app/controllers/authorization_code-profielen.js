'use strict';

var request = require('request');
var querystring = require('querystring');
var OAuth2 = require('oauth').OAuth2;
var logoutUtil = require('../utils/logout');

function getConfig() {
  var config = require(global.__base + '/config/services.conf.js');
  return JSON.parse(JSON.stringify(config));
}

function createAuthorizeUrl(type) {
  var envConfig = getConfig();
  var configOauth = envConfig[type].auth;

  var url = envConfig.consent.uri.scheme + '://' + envConfig.consent.uri.domain + envConfig.consent.uri.path;

  configOauth.lng = 'nl';
  configOauth.state = '32042809';
  delete configOauth.client_secret;
  url += querystring.stringify(configOauth);

  return url;
}

function createLogoutUrl(consentConfig, profileConfig, logoutRedirectUri, id, accessToken) {
  var options = {
    host: consentConfig.uri.scheme + '://' + consentConfig.uri.domain,
    path: '/v1/logout/redirect/encrypted',
    user_id: id,
    access_token: accessToken,
    redirect_uri: logoutRedirectUri,
    service: profileConfig.auth.service,
    client_id: profileConfig.auth.client_id,
    client_secret: profileConfig.auth.client_secret,
  };

  return logoutUtil.createLogoutUri(options);
}

function index(req, res) {
  res.render('index.ejs', {
    title: 'Login',
    urlAProfiel: createAuthorizeUrl('aprofiel'),
    urlMProfiel: createAuthorizeUrl('mprofiel'),
  });
}

function callback(req, res) {
  var envConfig = getConfig();
  var profileConfig = envConfig[req.params.profileType];

  if (!profileConfig) {
    return res.send('Invalid profile type');
  }

  var configOauth = profileConfig.auth;
  var configApi = profileConfig.uri;

  var oauth2 = new OAuth2(
    configOauth.client_id,
    configOauth.client_secret,
    configApi.scheme + '://' + configApi.domain,
    null,
    configApi.path + '/oauth2/token',
    null
  );

  oauth2.getOAuthAccessToken(
    req.query.code,
    { grant_type: 'authorization_code' },
    function handleTokenResponse(err, token) {
      if (err) {
        return res.send(err);
      }

      var profileUrl = configApi.scheme + '://' + configApi.domain + configApi.path + '/v1/me';

      request({
        url: profileUrl,
        auth: { bearer: token },
        json: true
      }, function handleApiCall(error, response, body) {
        if (error) {
          return res.send(error);
        }

        var user = {
          accessToken: token,
          service: profileConfig.auth.service,
          profile: {
            url: profileUrl,
            id: body.data.id,
            response: JSON.stringify(body, null, 4),
          },
          logoutUrl: createLogoutUrl(envConfig.consent, profileConfig, envConfig.logout_redirect_uri, body.data.id, token),
        };

        res.render('callback.ejs', {
          title: 'Login successful',
          user: user,
        });
      });
    }
  );
}

module.exports = {
  index: index,
  callback: callback,
};
