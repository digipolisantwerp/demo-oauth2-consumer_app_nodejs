const { cloneDeep } = require('lodash');
const axios = require('axios');
const { OAuth2 } = require('oauth');
const { getSessions, getSession } = require('../services/session.service');
const servicesConfig = require('../../config/services.conf');
const { createLogoutUrl, getLoginTypes } = require('../helpers/authUrl.helper');

async function callback(req, res, next) {
  try {
    const envConfig = JSON.parse(JSON.stringify(servicesConfig));
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
        return axios.get(profileUrl, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          const body = response.data;

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
            logoutUrl: createLogoutUrl(
              envConfig.consent,
              profileConfig,
              envConfig.logout_redirect_uri,
              userId,
              token,
              authType,
            ),
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
        }).catch((e) => res.send(e));
      },
    );
  } catch (e) {
    console.log('Something went wrong', e);
    return next(e);
  }
}

function index(req, res) {
  const envConfig = cloneDeep(servicesConfig);
  res.render('index.ejs', {
    title: 'Login',
    index: true,
    loginTypes: getLoginTypes(),
    baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
    baseurl_consent1: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent1}`,
    baseurl_consent2: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent2}`,
  });
}

function logoutCallback(req, res) {
  res.render('logout.ejs', { title: 'Logout successful' });
}

module.exports = {
  callback,
  index,
  logoutCallback,
};
