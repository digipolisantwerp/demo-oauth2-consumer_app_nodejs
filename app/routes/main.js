const { Router } = require('express');
const crtlProfiel = require('../controllers/authorization_code-profielen');

const router = Router();

router.get('/', crtlProfiel.index);
router.get('/callback/:profileType', crtlProfiel.callback);
router.get('/logoutCallback', crtlProfiel.logoutCallback);

module.exports = router;
