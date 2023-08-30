const { Issuer, generators } = require('openid-client');

const servicesConfig = require('../../config/services.conf');

async function index(req, res) {
  const {
    client_id,
    client_secret,
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
    scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
    redirect_uris: [redirect_uri],
    code_challenge,
    code_challenge_method: 'S256',
    nonce,
  });

  res.render('otp.ejs', {
    title: url,
    url,
    index: true,
  });
}

module.exports = {
  index,
};
