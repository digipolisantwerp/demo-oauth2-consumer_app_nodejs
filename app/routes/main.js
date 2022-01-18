const { Router } = require('express');
const crtlProfiel = require('../controllers/authorization_code-profielen');
const oidc = require('../controllers/oidc');
const otp = require('../controllers/otp');

const router = Router();

router.get('/', crtlProfiel.index);
router.get('/oidc', oidc.index);
router.get('/otp', otp.index);
router.get('/callback/:profileType', crtlProfiel.callback);
router.get('/callback_oidc/:profileType', oidc.callback);
router.get('/logoutCallback', crtlProfiel.logoutCallback);

module.exports = router;
