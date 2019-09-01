const uc = require('./users-controller');
const router = require('express').Router();
const pass = require('../middlewares/auth')

router.get('/', pass.authUser, uc.getUsers);

router.get('/:username', pass.authUser, uc.getUser);

router.patch('/:username', pass.authUser, uc.editUser);

router.patch('/:username/follow', pass.authUser, uc.followUser);

router.delete('/:username', pass.authUser, uc.delUser);

module.exports = router;