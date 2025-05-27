const jwtDecode = require('jwt-decode');
const crypto = require('crypto');
const { getSessions, getSession } = require('../services/session.service');
const tokenHelper = require('../helpers/token.helper');
const { stringifyObject } = require('../helpers/json.helper');
const servicesConfig = require('../../config/services.conf');
const dgpCorrelationService = require('../services/dgpCorrelation.service');
const { createLogoutUrl, getLoginTypes } = require('../helpers/authUrl.helper');

const envConfig = JSON.parse(JSON.stringify(servicesConfig));

function decode(token) {
  try {
    const { any_auth_code_otp, preferred_username } = jwtDecode(token);
    return stringifyObject({
      any_auth_code_otp,
      preferred_username,
    });
  } catch (e) {
    return false;
  }
}

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
    let token;
    // starting at v3 we will be using a keycloak token
    if (configOauth.version === 'v2' || configOauth.version === 'v1') {
      token = await tokenHelper.getKongAccessToken(
        req.query.code,
        configOauth,
        profileConfig,
      );
    } else {
      token = await tokenHelper.getKeycloakAccessToken(
        req.query.code,
        configOauth,
        req.cookies.code_verifier,
        req.cookies.nonce,
      );
    }

    const configApi = profileConfig.uri;
    const profileUrl = `${configApi.scheme}://${configApi.domain}${configApi.path}/me`;
    const headers = {
      authorization: `Bearer ${token}`,
    };
    if (configApi.correlation) {
      headers['Dgp-Correlation'] = dgpCorrelationService.getDgpCorrelation();
    }
    const response = await fetch(profileUrl, {
      headers,
    });
    let data;
    // fallback to be able to show non-json errors (gateway)
    if (response.headers.get('content-type').includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

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
    const decoded = decode(token);
    return res.setHeader('Content-Security-Policy', "script-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'").render('callback.ejs', {
      title: (response.status === 200) ? 'Login successful' : 'Login failed',
      status: (response.status === 200) ? 'success' : 'warning',
      user,
      session,
      decoded,
      sessions,
      baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
      beta_domain_consent: `${envConfig.betaConsent.uri.domain}`,
    });
  } catch (e) {
    if (e.response) {
      console.log('error callback', e.response.headers); // => the response payload
    }
    console.log('Something went wrong', e);
    return next(e);
  }
}

async function index(req, res) {
  const pkceChallenge = await import('pkce-challenge');
  const { code_verifier, code_challenge } = pkceChallenge.default(128);
  const nonce = crypto.randomBytes(128).toString('hex');
  res.cookie('code_verifier', code_verifier, { maxAge: 900000, httpOnly: true });
  res.cookie('nonce', nonce, { maxAge: 900000, httpOnly: true });

  res.setHeader('Content-Security-Policy', "script-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'").render('index.ejs', {
    title: 'Login',
    index: true,
    loginTypes: getLoginTypes(code_challenge, nonce),
    baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
    domain_consent: `${envConfig.consent.uri.domain}`,
    beta_baseurl_consent: `${envConfig.betaConsent.uri.scheme}://${envConfig.betaConsent.uri.domain}`,
    beta_domain_consent: `${envConfig.betaConsent.uri.domain}`,
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
