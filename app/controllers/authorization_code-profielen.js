'use strict';

var request = require('request');
var querystring = require('querystring');
var OAuth2 = require('oauth').OAuth2;
var logoutUtil = require('../utils/logout');

function getConfig() {
  var config = require(global.__base + '/config/services.conf.js');
  return JSON.parse(JSON.stringify(config));
}

function getSessions(ssokey, callback) {
  var envConfig = getConfig();
  request({
    url: envConfig.consent.api.url+'/sessions/'+ssokey,
    json: true,
    headers: {
      'apikey': envConfig.consent.api.key,
    }
  }, function handleApiCall(error, response, body) {
    if (error) {
      console.log('Something went wrong in getSession', error)
      return callback(error);
    }
    return callback(error, body);
  });
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

function createLogoutUrl(consentConfig, profileConfig, logoutRedirectUri, id, accessToken, auth_type) {
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
  if(auth_type && auth_type !== "undefined"){
    options.auth_type = auth_type;
  }
  return logoutUtil.createLogoutUri(options);
}

function getLoginTypes() {
  var loginTypeKeys = [
    'aprofiel',
    'digipolisgentdatastore',
    'fasdatastore',
    'mprofiel',
    'soprofiel',
  ];
  var config = getConfig();

  return loginTypeKeys.map(key => ({
    key: key,
    title: config[key].title,
    url: createAuthorizeUrl(key),
  }));
}

function index(req, res) {
  res.render('index.ejs', {
    title: 'Login',
    index: true,
    loginTypes: getLoginTypes(),
  });
}

function callback(req, res) {
  getSessions(req.cookies['dgp.auth.ssokey'], (err, response) => {
    if(err) {
      console.log('getSessions failed', err);
    }
    let existingSessions = '[]';
    if(response) {
      if(response.sessions) {
        existingSessions = JSON.stringify(response.sessions, null, 4);
      } else {
        existingSessions = JSON.stringify(response, null, 4);
      }
    }
    var envConfig = getConfig();
    var profileConfig = envConfig[req.params.profileType];
    var authType = req.query.auth_type;
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
        var profileUrl = configApi.scheme + '://' + configApi.domain + configApi.path + '/me';
        request({
          url: profileUrl,
          auth: { bearer: token },
          json: true
        }, function handleApiCall(error, response, body) {
          if (error) {
            return res.send(error);
          }
          var userResponse = body.data ? body.data : body;
          var user = {
            accessToken: token,
            ssoKey: req.cookies['dgp.auth.ssokey'],
            sessionsUrl: envConfig.consent.api.url + '/sessions/' + req.cookies['dgp.auth.ssokey'],
            service: profileConfig.auth.service,
            profile: {
              url: profileUrl,
              id: userResponse.id,
              response: JSON.stringify(body, null, 4),
            },
            logoutUrl: createLogoutUrl(envConfig.consent, profileConfig, envConfig.logout_redirect_uri, userResponse.id, token, authType),
          };
          res.render('callback.ejs', {
            title: 'Login successful',
            user: user,
            sessions: existingSessions,
          });
        });
      }
    );
  });
}

function logoutCallback(req, res) {
  res.render('logout.ejs', { title: 'Logout successful'});
}

module.exports = {
  index: index,
  callback: callback,
  logoutCallback: logoutCallback,
};
