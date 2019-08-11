const tweetModel = require('./tweets-model');
const userModel = require('../users/users-model');

const getTweets = (req, res) => {
    return tweetModel.find().sort({createdDate: req.query.order})
        .then(allTweets => res.json(allTweets))
        .catch(err => res.status(400).json(err));
}

const getTweet = (req, res) => {
    const tweetId = req.params.id;
    return tweetModel.findOne({"_id": tweetId}, (err, tweet) => {
        if(tweet) {
            return res.json(tweet);
        }else {
            return res.status(400).send('Tweet not found.');
        }
    });
}

const postTweet = (req, res) => {
    let newTweet = new tweetModel(req.body);
    return userModel.findOne({username: req.body.owner}, (err, user) => {
            if(user) {
                newTweet.createdDate = Date.now();
                newTweet.save()
                .then(() => {
                    user.tweets.push(newTweet._id);
                    user.save();
                    return res.json(newTweet)
                }).catch(err => res.status(400).json(err));
            }else {
                return res.status(400).send('This user do not exists.');
            }
        });
}

const delTweet = (req, res) => {
    const tweetId = req.params.id;
    return tweetModel.deleteOne({_id: tweetId}, (err, tweet) => {
        if(err) {
            res.status(404).json(err);
        }else if(tweet.deletedCount){
            return res.json(tweet);
        }else {
            return res.status(400).send('That tweet could not be deleted.');
        }
    });
}

module.exports = {
    getTweets,
    getTweet,
    postTweet,
    delTweet
}