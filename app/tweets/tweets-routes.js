const router = require('express').Router();
const tc = require('./tweets-controller');
const pass = require('../middlewares/auth')

router.get('/', pass.authUser, tc.getTweets);

router.get('/:id', pass.authUser, tc.getTweet);

router.post('/', pass.authUser, tc.postTweet);

router.patch('/:id', pass.authUser, tc.likeTweet)

router.delete('/:id', pass.authUser, tc.delTweet);

module.exports = router;