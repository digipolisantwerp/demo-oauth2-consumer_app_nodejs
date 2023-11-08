const { Router } = require('express');
const crtlProfiel = require('../controllers/authorization_code-profielen');
const oidc = require('../controllers/oidc');
const otp = require('../controllers/otp');
const loginToken = require('../controllers/login-token');
const getLoginToken = require('../controllers/get-login-token');

const router = Router();

router.get('/', crtlProfiel.index);
router.get('/oidc', oidc.index);
router.get('/otp', otp.index);
router.get('/login-token', loginToken.index);
router.get('/get-login-token', getLoginToken.index);
router.post('/get-login-token', getLoginToken.post);
router.get('/callback/:profileType', crtlProfiel.callback);
router.get('/callback_oidc/:profileType', oidc.callback);
router.get('/logoutCallback', crtlProfiel.logoutCallback);

module.exports = router;
