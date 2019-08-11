const router = require('express').Router();
const tc = require('./tweets-controller');

router.get('/', tc.getTweets);

router.get('/:id', tc.getTweet);

router.post('/', tc.postTweet);

router.patch('/:id', tc.likeTweet)

router.delete('/:id', tc.delTweet);

module.exports = router;