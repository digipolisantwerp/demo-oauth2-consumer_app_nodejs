const { getSessions, getSession } = require('../services/session.service');
const { createLogoutUrl } = require('../helpers/authUrl.helper');
const tokenHelper = require('../helpers/token.helper');
const { stringifyObject } = require('../helpers/json.helper');
const dgpCorrelationService = require('../services/dgpCorrelation.service');
const servicesConfig = require('../../config/services.conf');

const envConfig = JSON.parse(JSON.stringify(servicesConfig));

async function callback(req, res, next) {
  try {
    const profileConfig = envConfig[req.params.profileType];
    if (!profileConfig) return res.send('Invalid profile type');

    // set service provider & method
    if (req.query.sp) profileConfig.auth.service = req.query.sp;
    if (req.query.method) profileConfig.auth.method = req.query.method;
    const ssokey = req.cookies['dgp.auth.ssokey'];
    const authType = req.query.auth_type;

    const [session, sessions] = (await Promise.all([
      getSession(ssokey, profileConfig.auth.client_id),
      getSessions(ssokey),
    ])).map((result) => stringifyObject(result));

    const configOauth = profileConfig.auth;
    const token = await tokenHelper.getKeycloakAccessToken(
      req.query.code,
      {
        ...configOauth,
        redirect_uri: 'http://localhost:3000/callback_oidc/profiel_keycloak',
      },
      req.cookies.code_verifier,
      req.cookies.nonce,
    );
    const configApi = profileConfig.uri;
    const profileUrl = `${configApi.scheme}://${configApi.domain}${configApi.path}/me`;
    const headers = {
      authorization: `Bearer ${token}`,
    };
    if (configApi.correlation) {
      headers['Dgp-Correlation'] = dgpCorrelationService.getDgpCorrelation();
    }
    const response = await fetch(
      profileUrl,
      {
        headers,
      },
    );
    const data = await response.json();

    const body = data;
    if (!body) {
      return res.json({ error: `Missing profile body (status code ${response.status})` });
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
      title: (response.status === 200) ? 'Login successful' : 'Login failed',
      status: (response.status === 200) ? 'success' : 'warning',
      user,
      session,
      sessions,
      baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
    });
  } catch (e) {
    console.log('Something went wrong', e);
    return next(e);
  }
}

function logoutCallback(req, res) {
  res.render('logout.ejs', { title: 'Logout successful' });
}

module.exports = {
  callback,
  logoutCallback,
};
