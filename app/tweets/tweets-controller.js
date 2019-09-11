const tweetModel = require('./tweets-model');
const userModel = require('../users/users-model');

const getTweets = (req, res) => {
    return tweetModel.find().sort({createdDate: req.query.order})
        .then(allTweets => res.json(allTweets))
        .catch(err => res.status(400).json(err));
}

const getTimeLine = (req, res) => {
    let following = req.user.following;
    let username = req.user.username;
    tweetModel.find({owner: {$in: following}}).sort({createdDate: 'desc'})
        .then(data => res.json({data, username}))
        .catch(error => res.status(400).json({error}));
}

const getTweetsOfUser = (req, res) => {
    let username = req.user.username;
    tweetModel.find({owner: username}).sort({createdDate: 'desc'})
        .then(data => res.json({data}))
        .catch(error => res.status(400).json({error}));
}

const getLikesOfUser = (req, res) => {
    let username = req.user.username;
    tweetModel.find({likes: {$in: username}})
        .then(data => res.json({data}))
        .catch(error => res.status(400).json({error}));
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
    let username = req.user.username;

    userModel.findOne({username})
        .then(() => {
            tweetModel.updateOne({_id: tweetId}, {$push: {likes: username}})
                .then(() => res.send({Respose: `Tweet liked by ${username}.`}))
                .catch(error => res.status(404).json({error}))
        })
        .catch(() => res.status(404).send({error: 'User not found'}))
}

const dislikeTweet = (req, res) => {
    let tweetId = req.params.id;
    let username = req.user.username;
    
    userModel.findOne({username})
        .then(() => {
            tweetModel.updateOne({_id: tweetId}, {$pull: {likes: username}})
                .then(() => res.send({Respose: `Tweet disliked by ${username}.`}))
                .catch(error => res.status(404).json({error}))
        })
        .catch(() => res.status(404).send({error: 'User not found'}))
}

const delTweet = (req, res) => {
    const tweetId = req.params.id;
    tweetModel.findByIdAndDelete(tweetId)
        .then(tweet => {
            if(req.user.username != tweet.owner){
                return res.status(400).send(`${req.user.username} cannot delete ${tweet.owner}'s tweet.`)
            }
            userModel.updateOne({username: tweet.owner}, {$pull: {tweets: tweetId}})
                .then(() => res.send(`${tweet.owner} has successfully deleted tweet: ${tweet._id}`))
                .catch(err => res.status(404).json(err));
        })
        .catch(err => res.status(400).json(err))
}

module.exports = {
    getTweets,
    getTimeLine,
    getTweetsOfUser,
    getLikesOfUser,
    getTweet,
    postTweet,
    likeTweet,
    dislikeTweet,
    delTweet
}