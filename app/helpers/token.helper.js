const { OAuth2 } = require('oauth');
const { jwtDecode } = require('jwt-decode');

const config = require('../../config/services.conf');

async function getTokenConsent() {
  try {
    if (config.consent.api.url.includes('localhost')) return '';
    const response = await fetch(`${config.consent.api.url}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.consent.api.client_id,
        client_secret: config.consent.api.client_secret,
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (e) {
    console.log('Something went wrong in getTokenConsent', e);
    throw (e);
  }
}

async function getKongAccessToken(code, configOauth, profileConfig) {
  return new Promise((resolve, reject) => {
    const configApi = profileConfig.uri;
    const oauth2 = new OAuth2(
      configOauth.client_id,
      configOauth.client_secret,
      `${configApi.scheme}://${configApi.domain}`,
      null,
      `${configApi.path}/oauth2/token`,
      null,
    );

    oauth2.getOAuthAccessToken(
      code,
      { grant_type: 'authorization_code' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      },
    );
  });
}

async function getKeycloakAccessToken(code, configOauth, code_verifier, nonce) {
  const params = new URLSearchParams();
  params.append('client_id', configOauth.client_id);
  params.append('client_secret', configOauth.client_secret);
  params.append('grant_type', 'authorization_code');
  params.append('code_verifier', code_verifier);
  params.append('code', code);
  params.append('redirect_uri', configOauth.redirect_uri);
  const response = await fetch(`${configOauth.tokenurl}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  const data = await response.json();
  console.log('getKeycloakAccessToken', data);
  const decoded = jwtDecode(data.access_token);
  if (decoded.nonce !== nonce) throw new Error('Nonce mismatch');

  return data.access_token;
}

module.exports = {
  getTokenConsent,
  getKongAccessToken,
  getKeycloakAccessToken,
};
