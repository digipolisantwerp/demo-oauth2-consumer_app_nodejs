'use strict';

var request = require('request');
var querystring = require('querystring');
var OAuth2 = require('oauth').OAuth2;

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

function index(req, res) {
  res.render('index.ejs', {
    title: 'Log in',
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
        };

        res.render('callback.ejs', {
          title: 'Logged in successfully',
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
