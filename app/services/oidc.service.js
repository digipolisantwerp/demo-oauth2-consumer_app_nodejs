const oidcclient = require('openid-client');
const servicesConfig = require('../../config/services.conf');

async function getAuthorizationParams() {
  try {
    const {
      client_id,
      client_secret,
      redirect_uri,
      oidc_issuer,
    } = servicesConfig.profiel_keycloak.auth;
    const issuer = await oidcclient.discovery(`${oidc_issuer}/.well-known/openid-configuration`);
    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
    const code_verifier = oidcclient.randomPKCECodeVerifier();
    const nonce = oidcclient.randomNonce();
    const client = new issuer.Client({
      client_id,
      client_secret,
      redirect_uris: [redirect_uri],
    });
    const url = client.authorizationUrl({});
    return {
      url,
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
