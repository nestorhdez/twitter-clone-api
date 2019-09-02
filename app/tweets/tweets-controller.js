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
    if(req.user.username != req.body.owner){
        return res.status(400).send(`${req.user.username} cannot post a tweet for ${req.body.owner}'s account.`)
    }
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

const likeTweet = (req, res) => {
    let tweetId = req.params.id;
    let username = req.query.username;
    if(req.user.username != username){
        return res.status(400).send(`${req.user.username} cannot like a tweet for ${username}'s account.`)
    }
    userModel.findOne({username})
        .then(() => {
            tweetModel.updateOne({_id: tweetId}, {$push: {likes: username}})
                .then(() => res.send({Respose: `Tweet liked by ${username}.`}))
                .catch(error => res.status(404).json({error}))
        })
        .catch(error => res.status(404).send({error: 'User not found'}))
}

const dislikeTweet = (req, res) => {
    let tweetId = req.params.id;
    let username = req.query.username;
    if(req.user.username != username){
        return res.status(400).send(`${req.user.username} cannot like a tweet for ${username}'s account.`)
    }
    userModel.findOne({username})
        .then(() => {
            tweetModel.updateOne({_id: tweetId}, {$pull: {likes: username}})
                .then(() => res.send({Respose: `Tweet disliked by ${username}.`}))
                .catch(error => res.status(404).json({error}))
        })
        .catch(error => res.status(404).send({error: 'User not found'}))
}

const delTweet = async (req, res) => {
    const tweetId = req.params.id;
    return tweetModel.findByIdAndDelete(tweetId)
        .then(tweet => {
            if(req.user.username != tweet.owner){
                return res.status(400).send(`${req.user.username} cannot delete ${tweet.owner}'s tweet.`)
            }
            return userModel.findOne({username: tweet.owner})
                .then(user => {
                    user.tweets = user.tweets.filter(id => id != tweetId);
                    return user.save()
                        .then(() => res.send(`${user.username} has successfully deleted tweet: ${tweet._id}`))
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err))
        })
        .catch(err => res.status(400).json(err))
}

module.exports = {
    getTweets,
    getTweet,
    postTweet,
    likeTweet,
    dislikeTweet,
    delTweet
}