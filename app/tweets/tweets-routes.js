const router = require('express').Router();
const tc = require('./tweets-controller');
const pass = require('../middlewares/auth')

router.get('/', pass.authUser, tc.getTweets);

router.get('/timeline', pass.authUser, tc.getTimeLine);

router.get('/user', pass.authUser, tc.getTweetsOfUser);

router.get('/:id', pass.authUser, tc.getTweet);

router.post('/', pass.authUser, tc.postTweet);

router.patch('/like/:id', pass.authUser, tc.likeTweet)

router.patch('/dislike/:id', pass.authUser, tc.dislikeTweet)

router.delete('/:id', pass.authUser, tc.delTweet);

module.exports = router;