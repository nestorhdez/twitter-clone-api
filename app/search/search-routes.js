const router = require('express').Router();
const pass = require('../middlewares/auth');
const controller = require('./search-controller');

router.get('/', pass.authUser, controller.search);

module.exports = router;