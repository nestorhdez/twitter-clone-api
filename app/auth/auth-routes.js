const router = require('express').Router();
const auth = require('./auth-controller');
const jwt = require('../helpers/jwt')

router.post('/signup', auth.signUp)

router.post('/login', auth.logIn)

router.post('/token', jwt.refreshToken)

module.exports = router;