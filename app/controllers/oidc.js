const axios = require('axios');
const { Issuer, generators } = require('openid-client');

const { getSessions, getSession } = require('../services/session.service');
const { createLogoutUrl } = require('../helpers/authUrl.helper');
const tokenHelper = require('../helpers/token.helper');
const { stringifyObject } = require('../helpers/json.helper');
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
    const response = await axios.get(profileUrl, { headers: { authorization: `Bearer ${token}` }, validateStatus: false });

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
      title: (response.status === 200) ? 'Login successful' : 'Login failed',
      status: (response.status === 200) ? 'success' : 'warning',
      user,
      session,
      sessions,
      baseurl_consent: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}`,
      baseurl_consent1: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent1}`,
      baseurl_consent2: `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain_consent2}`,
    });
  } catch (e) {
    console.log('Something went wrong', e);
    return next(e);
  }
}

async function index(req, res) {
  const {
    client_id,
    client_secret,
    auth_methods,
    redirect_uri,
    oidc_issuer,
  } = servicesConfig.profiel_keycloak.auth;
  const issuer = await Issuer.discover(`${oidc_issuer}/.well-known/openid-configuration`);
  console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);

  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  const nonce = generators.nonce();

  res.cookie('code_verifier', code_verifier, { maxAge: 900000, httpOnly: true });
  res.cookie('nonce', nonce, { maxAge: 900000, httpOnly: true });
  const client = new issuer.Client({
    client_id,
    client_secret,
    redirect_uris: [redirect_uri],
  });
  const url = client.authorizationUrl({
    scope: 'astad.aprofiel.v1.username',
    redirect_uris: [redirect_uri],
    auth_methods,
    code_challenge,
    code_challenge_method: 'S256',
    nonce,
  });

  res.render('oidc.ejs', {
    title: url,
    url,
    index: true,
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