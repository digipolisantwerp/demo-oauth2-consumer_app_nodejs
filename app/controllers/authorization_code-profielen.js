'use strict';

var request = require('request');
var querystring = require('querystring');
var OAuth2 = require('oauth').OAuth2;
var logoutUtil = require('../utils/logout');

function getConfig() {
  var config = require(global.__base + '/config/services.conf.js');
  return JSON.parse(JSON.stringify(config));
}

function getSession(ssokey, clientId) {
  var envConfig = getConfig();
  return new Promise((resolve, reject) => {
    if(!ssokey){
      return reject('no cookie set');
    }
    request({
      url: envConfig.consent.api.url+'/sessions/'+ssokey+'/'+clientId,
      json: true,
      headers: {
        'apikey': envConfig.consent.api.key,
      }
    }, (error, response, body) => {
      if (error) {
        console.log('Something went wrong in getSession', error)
        return reject(error);
      }
      return resolve(body);
    });
  });
}

function getSessions(ssokey) {
  var envConfig = getConfig();
  return new Promise((resolve, reject) => {
    if(!ssokey){
      return reject('no cookie set');
    }
    request({
      url: envConfig.consent.api.url+'/sessions/'+ssokey,
      json: true,
      headers: {
        'apikey': envConfig.consent.api.key,
      }
    }, function handleApiCall(error, response, body) {
      if (error) {
        console.log('Something went wrong in getSession', error)
        return reject(error);
      }
      return resolve(body);
    });
  });
}
function createAuthorizeUrl(type) {
  var envConfig = getConfig();
  var configOauth = envConfig[type].auth;
  var url = envConfig.consent.uri.scheme + '://' + envConfig.consent.uri.domain + '/' + configOauth.version + envConfig.consent.uri.path;
  configOauth.lng = 'nl';
  configOauth.state = '32042809';
  delete configOauth.client_secret;
  delete configOauth.version;
  url += querystring.stringify(configOauth);

  return url;
}

function createLogoutUrl(consentConfig, profileConfig, logoutRedirectUri, id, accessToken, auth_type) {
  var options = {
    host: consentConfig.uri.scheme + '://' + consentConfig.uri.domain,
    path: `/${profileConfig.auth.version}/logout/redirect/encrypted`,
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
    'profiel',
    'aprofiel',
    'mprofiel',
    'fasdatastore',
    'soprofiel',
    'digipolisgentdatastore',
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

async function callback(req, res) {
  var envConfig = getConfig();
  var profileConfig = envConfig[req.params.profileType];
  // set service provider
  if(req.query.sp) {
    profileConfig.auth.service = req.query.sp;
  }
  const session = JSON.stringify(await getSession(req.cookies['dgp.auth.ssokey'], profileConfig.auth.client_id), null, 4);
  const sessionsResponse = await getSessions(req.cookies['dgp.auth.ssokey'])
  let existingSessions = '[]';
  if(sessionsResponse) {
    if(sessionsResponse.sessions) {
      existingSessions = JSON.stringify(sessionsResponse.sessions, null, 4);
    } else {
      existingSessions = JSON.stringify(sessionsResponse, null, 4);
    }
  }
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
        var userId = userResponse.profile ? userResponse.profile.id : userResponse.id;
        var user = {
          accessToken: token,
          ssoKey: req.cookies['dgp.auth.ssokey'],
          client_id: profileConfig.auth.client_id,
          sessionsUrl: envConfig.consent.api.url + '/sessions/' + req.cookies['dgp.auth.ssokey'],
          sessionUrl: envConfig.consent.api.url + '/sessions/' + req.cookies['dgp.auth.ssokey'] + '/' + profileConfig.auth.client_id,
          service: profileConfig.auth.service,
          profile: {
            url: profileUrl,
            id: userId,
            response: JSON.stringify(body, null, 4),
          },
          logoutUrl: createLogoutUrl(envConfig.consent, profileConfig, envConfig.logout_redirect_uri, userId, token, authType),
        };
        res.render('callback.ejs', {
          title: 'Login successful',
          user: user,
          session: session,
          sessions: existingSessions,
        });
      });
    }
  );
}

function logoutCallback(req, res) {
  res.render('logout.ejs', { title: 'Logout successful'});
}

module.exports = {
  index: index,
  callback: callback,
  logoutCallback: logoutCallback,
};
