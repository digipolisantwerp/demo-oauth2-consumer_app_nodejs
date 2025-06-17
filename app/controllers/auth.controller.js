const msal  = require('@azure/msal-node');
const logger = require('../helpers/logging.helper');
const { msalConfig } = require('../../config/services.conf');

// Create msal application object
const cca = new msal.ConfidentialClientApplication(msalConfig);

async function login(req, res) {
  const authCodeUrlParameters = {
    scopes: ['user.read'],
    redirectUri: `${req.protocol}://${req.get('host')}/callback`,
    responseMode: 'form_post',
  };

  // get url to sign user in and consent to scopes needed for application
  const authcodeUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
  res.redirect(authcodeUrl);
}

async function callback(req, res, next) {
  try {
    const tokenRequest = {
      code: req.body.code,
      scopes: ['user.read'],
      redirectUri: `${req.protocol}://${req.get('host')}/callback`,
    };
    const response = await cca.acquireTokenByCode(tokenRequest);


    // render in demo app
    return res.setHeader('Content-Security-Policy', "script-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'").render('callback.ejs', {
      title: (response.status === 200) ? 'Login successful' : 'Login failed',
      status: (response.status === 200) ? 'success' : 'warning',
      user: {
        accessToken: response.accessToken,
        profile: {
          url: '< user from idToken > graph also exposes /me',
          id: response.idTokenClaims.sub,
          response: JSON.stringify( response.idTokenClaims, null, 4 ),
        },
        logoutUrl: '/logout'
      },
      session: false,
      decoded: false,
      sessions: false,
      baseurl_consent: '',
      beta_domain_consent: ``,
    });
  } catch (e) {
    logger.log('callback failed', e);
    return next(e);
  }
}

function logout(req, res) {
  return res.redirect('/');
}

function isLoggedin (req, res, next) {
  try {
    if (req.session.user) return res.json({ user: req.session.user, isLoggedin: true });
    return res.json({ isLoggedin: false });
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  isLoggedin,
  logout,
  callback,
  login
}
