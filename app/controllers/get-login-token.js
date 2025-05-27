const config = require('../../config/services.conf');

const { getAuthorizationParams } = require('../services/oidc.service');

async function post(req, res, next) {
  try {
    const response = await fetch(`${config.consent.uri.scheme}://${config.consent.uri.domain}/v1/api/get-login-token`, {
      method: 'POST',
      headers: {
        authorization: req.headers.authorization,
      },
    });
    const data = await response.json();
    return res.json(data);
  } catch (e) {
    return next(e);
  }
}

async function index(req, res) {
  const {
    url,
    code_verifier,
    client_id,
    nonce,
  } = getAuthorizationParams();

  res.cookie('code_verifier', code_verifier, { maxAge: 900000, httpOnly: true });
  res.cookie('nonce', nonce, { maxAge: 900000, httpOnly: true });

  res.render('get-login-token.ejs', {
    title: url,
    url: `${config.consent.uri.scheme}://${config.consent.uri.domain}/v1/api/get-login-token`,
    client_id,
    nonce,
    state: '32042809',
    redirect_uri: `${req.protocol}://${req.get('host')}`,
  });
}

module.exports = {
  index,
  post,
};
