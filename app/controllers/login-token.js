const { Issuer, generators } = require('openid-client');

const config = require('../../config/services.conf');
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
  const nonce = generators.nonce();

  res.cookie('code_verifier', code_verifier, { maxAge: 900000, httpOnly: true });
  res.cookie('nonce', nonce, { maxAge: 900000, httpOnly: true });
  const client = new issuer.Client({
    client_id,
    client_secret,
    redirect_uris: [redirect_uri],
  });

  const url = client.authorizationUrl({});
  const urlobj = new URL(url);
  urlobj.searchParams.sort();

  res.render('login-token.ejs', {
    title: url,
    url: `${config.consent.uri.scheme}://${config.consent.uri.domain}/v3/login-token`,
    client_id,
    nonce,
    state: '32042809',
    redirect_uri: `${req.protocol}://${req.get('host')}`,
  });
}

module.exports = {
  index,
};
