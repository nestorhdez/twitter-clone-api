const fsControl = require('../files/file-controller');
const uuidv1 = require('uuid/v1');

const getTweets = (req, res) => {
    let tweets = fsControl.readTweets();
    const order = req.query.order;
    let tweetsOrdered;
    if(order == 'asc'){
        tweetsOrdered = tweets.sort((a, b) => a.createdDate > b.createdDate);
    }else if(order == 'desc') {
        tweetsOrdered = tweets.sort((a, b) => a.createdDate < b.createdDate);
    }else {
        return res.status(400).send('The order query parameter has to be "asc" or "desc".')
    }
    return res.status(200).json(tweetsOrdered);
}

const getTweet = (req, res) => {
    let tweets = fsControl.readTweets();
    const tweetId = req.params.id;
    let tweet = tweets.find(tweet => tweet.id == tweetId);
    if(tweet){
        return res.status(200).json(tweet);
    }else {
        return res.status(404).send('tweet don\'t found.');
    }
}

const postTweet = (req, res) => {
    let users = fsControl.readUsers();
    let tweets = fsControl.readTweets();
    const tweet = req.body;
    const username = tweet.owner;
    let user = users.find(user => user.username == username);
    if( !user ){
        return res.status(404).send('This user do not exist.');        
    }else if(tweet.text == undefined || tweet.text == ''){
        return res.status(400).send('The content of the tweet cannot be empty.')
    }else if(tweet.length > 258){
        return res.status(400).send('The tweet cannot have more than 258 characters.');
    }else {
        tweet.id = uuidv1();
        tweet.createdDate = Date.now();
        user.tweets.push(tweet.id);
        tweets.push(tweet);
        fsControl.writeUsers(users);
        fsControl.writeTweets(tweets);
        return res.status(201).json(tweet);
    }
}

const delTweet = (req, res) => {
    let users = fsControl.readUsers();
    let tweets = fsControl.readTweets();
    const tweetId = req.params.id;
    let tweet = tweets.find(tweet => tweet.id == tweetId);
    if( tweet ){
        let user = users.find(user => user.username == tweet.owner);
        user.tweets = user.tweets.filter(id => id !== tweet.id);
        tweets = tweets.filter(currentTweet => currentTweet.id != tweetId);
        fsControl.writeUsers(users);
        fsControl.writeTweets(tweets);
        return res.status(200).json({tweet});
    }else {
        return res.status(404).send('This tweet id do not exist.');
    }
}

module.exports = {
    getTweets,
    getTweet,
    postTweet,
    delTweet
}