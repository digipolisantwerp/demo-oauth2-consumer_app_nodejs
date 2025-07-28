const oidcclient = require('openid-client');
const servicesConfig = require('../../config/services.conf');

async function getAuthorizationParams() {
  try {
    const {
      client_id,
      oidc_issuer,
    } = servicesConfig.profiel_keycloak.auth;
    const response = await fetch(`${oidc_issuer}/.well-known/openid-configuration`);
    const data = await response.json();
    const code_verifier = oidcclient.randomPKCECodeVerifier();
    const nonce = oidcclient.randomNonce();
    return {
      url: data.authorization_endpoint,
      client_id,
      code_verifier,
      nonce,
    };
  } catch (e) {
    console.log('Something went wrong in getAuthorizationUrl', e);
    throw e;
  }
}

module.exports = {
  getAuthorizationParams,
};
