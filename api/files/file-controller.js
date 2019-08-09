const fs = require('fs');
const readUsers = () => JSON.parse(fs.readFileSync('users.txt', 'utf8'));
const readTweets = () => JSON.parse(fs.readFileSync('tweets.txt', 'utf8'));
const writeUsers = (data) => fs.writeFileSync('users.txt', JSON.stringify(data));
const writeTweets = (data) => fs.writeFileSync('tweets.txt', JSON.stringify(data));

module.exports = {
    readUsers,
    readTweets,
    writeTweets,
    writeUsers
}