const uc = require('./users-controller');
const router = require('express').Router();
const pass = require('../middlewares/auth')

router.get('/', pass.authUser, uc.getUsers);

router.get('/:username', pass.authUser, uc.getUser);

router.patch('/:username', pass.authUser, uc.editUser);

router.patch('/follow/:username', pass.authUser, uc.followUser);

router.patch('/unfollow/:username', pass.authUser, uc.unfollowUser);

router.delete('/:username', pass.authUser, uc.delUser);

module.exports = router;