const express = require('express');
const crtlProfiel = require('../controllers/authorization_code-profielen');
const oidc = require('../controllers/oidc');
const loginToken = require('../controllers/login-token');
const getLoginToken = require('../controllers/get-login-token');
const { login, logout, callback } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', crtlProfiel.index);
router.get('/ping', (req, res) => res.json({ ping: 'ok' }));
router.get('/login-token', loginToken.index);
router.get('/get-login-token', getLoginToken.index);
router.post('/get-login-token', getLoginToken.post);
router.get('/callback/:profileType', crtlProfiel.callback);
router.get('/callback_oidc/:profileType', oidc.callback);
router.get('/logoutCallback', crtlProfiel.logoutCallback);
router.get('/login', login);
router.get('/logout', logout);
router.post('/callback', callback);

router.use('/', express.static('./public'));

module.exports = router;
