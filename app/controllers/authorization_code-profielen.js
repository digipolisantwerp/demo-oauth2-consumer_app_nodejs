const { cloneDeep } = require('lodash');
const request = require('request');
const querystring = require('querystring');
const { OAuth2 } = require('oauth');
const logoutUtil = require('../utils/logout');
const { getSessions, getSession } = require('../services/session.service');
const servicesConfig = require('../../config/services.conf.js');

function createAuthorizeUrl(type) {
  const envConfig = cloneDeep(servicesConfig);
  const configOauth = Object.assign({}, envConfig[type].auth);
  let url = `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}/${configOauth.version}${envConfig.consent.uri.path}`;
  configOauth.lng = 'nl';
  configOauth.state = '32042809';
  delete configOauth.client_secret;
  delete configOauth.version;
  url += querystring.stringify(configOauth);
  return url;
}

function createLogoutUrl(consentConfig, profileConfig, logoutRedirectUri, id, accessToken, auth_type) {
  const options = {
    host: `${consentConfig.uri.scheme}://${consentConfig.uri.domain}`,
    path: `/${profileConfig.auth.version}/logout/redirect/encrypted`,
    user_id: id,
    method: profileConfig.auth.method,
    access_token: accessToken,
    redirect_uri: logoutRedirectUri,
    service: profileConfig.auth.service,
    client_id: profileConfig.auth.client_id,
    client_secret: profileConfig.auth.client_secret,
  };
  if (auth_type && auth_type !== 'undefined') {
    options.auth_type = auth_type;
  }
  return logoutUtil.createLogoutUri(options);
}

async function callback(req, res, next) {
  try {
    const envConfig = cloneDeep(servicesConfig);
    const profileConfig = envConfig[req.params.profileType];
    // set service provider
    if (req.query.sp) {
      profileConfig.auth.service = req.query.sp;
    }
    if (req.query.method) {
      profileConfig.auth.method = req.query.method;
    }
    const session = JSON.stringify(await getSession(req.cookies['dgp.auth.ssokey'], profileConfig.auth.client_id), null, 4);
    const sessionsResponse = await getSessions(req.cookies['dgp.auth.ssokey']);
    let existingSessions = '[]';
    if (sessionsResponse) {
      existingSessions = JSON.stringify(sessionsResponse, null, 4);
    }
    const authType = req.query.auth_type;
    if (!profileConfig) {
      return res.send('Invalid profile type');
    }

    const configOauth = profileConfig.auth;
    const configApi = profileConfig.uri;
    const oauth2 = new OAuth2(
      configOauth.client_id,
      configOauth.client_secret,
      `${configApi.scheme}://${configApi.domain}`,
      null,
      `${configApi.path}/oauth2/token`,
      null,
    );
    return oauth2.getOAuthAccessToken(
      req.query.code,
      { grant_type: 'authorization_code' },
      (err, token) => {
        if (err) {
          return res.send(err);
        }
        const profileUrl = `${configApi.scheme}://${configApi.domain}${configApi.path}/me`;
        return request({
          url: profileUrl,
          auth: { bearer: token },
          json: true,
        }, (error, response, body) => {
          if (error) {
            return res.send(error);
          }

          if (!body) {
            return res.json({ error: `Missing profile body (status code ${response.statusCode})` });
          }

          const userResponse = body.data ? body.data : body;
          const userId = userResponse.profile ? userResponse.profile.id : userResponse.id;
          const user = {
            accessToken: token,
            ssoKey: req.cookies['dgp.auth.ssokey'],
            client_id: profileConfig.auth.client_id,
            sessionsUrl: `${envConfig.consent.api.url}/sessions/${req.cookies['dgp.auth.ssokey']}`,
            sessionUrl: `${envConfig.consent.api.url}/sessions/${req.cookies['dgp.auth.ssokey']}/clientid/${profileConfig.auth.client_id}`,
            service: profileConfig.auth.service,
            profile: {
              url: profileUrl,
              id: userId,
              response: JSON.stringify(body, null, 4),
            },
            logoutUrl: createLogoutUrl(envConfig.consent, profileConfig, envConfig.logout_redirect_uri, userId, token, authType),
          };
          return res.render('callback.ejs', {
            title: 'Login successful',
            user,
            session,
            sessions: existingSessions,
            baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
            baseurl_consent1: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent1}`,
            baseurl_consent2: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent2}`,
          });
        });
      },
    );
  } catch (e) {
    console.log('Something went wrong', e);
    return next(e);
  }
}

function logoutCallback(req, res) {
  res.render('logout.ejs', { title: 'Logout successful' });
}

function getLoginTypes() {
  const loginTypeKeys = [
    'profiel',
    'aprofiel',
    'mprofiel',
    'pza',
    'fasdatastore',
    'soprofiel',
    'zorgbedrijf',
    'digipolisgentdatastore',
    'provantprofiel',
    'profiel_enterprise',
    'profiel_hintedlogin',
  ];
  return loginTypeKeys.map(key => ({
    key,
    title: servicesConfig[key].title,
    url: createAuthorizeUrl(key),
  }));
}

function index(req, res) {
  const envConfig = cloneDeep(servicesConfig);
  res.render('index.ejs', {
    title: 'Login',
    index: true,
    loginTypes: getLoginTypes(),
    baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
    baseurl_consent1: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent1}/hello`,
    baseurl_consent2: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent2}`,
  });
}

module.exports = {
  index,
  callback,
  logoutCallback,
};
