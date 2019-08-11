const uc = require('./users-controller');
const router = require('express').Router();

router.get('/', uc.getUsers);

router.get('/:username', uc.getUser);

router.post('/', uc.postUser);

router.patch('/:username', uc.patchUser);

router.patch('/:username/follow', uc.followUser);

router.delete('/:username', uc.delUser);

module.exports = router;