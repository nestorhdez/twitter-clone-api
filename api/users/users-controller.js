const fsControl = require('../files/file-controller');
const aux = require('../aux/aux');

const getUsers = (req, res) => {
    let users = fsControl.readUsers();
    return res.status(200).json(users);
}

const getUser = (req, res) => {
    let users = fsControl.readUsers();
    const username = req.params.username.toLowerCase();
    let user = users.find(user => user.username == username);
    if(user){
        return res.status(200).json(user);
    }else {
        return res.status(404).send('User don\'t found.');
    }
}

const postUser = (req, res) => {
    let users = fsControl.readUsers();
    if(!req.body.username || req.body.username == '') {
        return res.status(400).send('Set a username is needed.');
    }else if(!req.body.email || req.body.email == '') {
        return res.status(400).send('Set an email is needed.');
    }else if( users.find(user => user.username == req.body.username) ) {
        return res.status(400).send('This username already exists.');
    }else if( users.find(user => user.email == req.body.email) ) {
        return res.status(400).send('This email already has an account.');
    }else {
        const user = {};
        user.username = req.body.username.toLowerCase();
        req.body.name ? user.name = req.body.name.toLowerCase() : '';
        user.email = req.body.email;
        user.tweets = [];
        user.createdDate = Date.now();
        users.push(user);
        fsControl.writeUsers(users);
        return res.status(201).json(user);
    }
}

const patchUser = (req, res) => {
    let users = fsControl.readUsers();
    let body = req.body;
    let username = req.params.username;
    let user = users.find(user => user.username == username);
    if(body.name == '' || body.email == ''){
        return res.status(400).send('Cannot change any value to empty text.');
    }else if(user) {
        user.name != body.name && body.name != undefined ? user.name = body.name.toLowerCase() : '';
        user.email != body.email && body.email != undefined ? user.email = body.email : '';
        fsControl.writeUsers(users);
        return res.status(200).json(user);
    }else {
        return res.status(404).send('This username do not exist.');
    }
}

const delUser = (req, res) => {
    let users = fsControl.readUsers();
    let tweets = fsControl.readTweets();
    const username = req.params.username.toLowerCase();
    let user = users.find(user => user.username == username);
    if(user){
        user.tweets.forEach(val => tweets.splice(aux.getIndex(tweets, val), 1) );
        users = users.filter(user => user.username != username);
        fsControl.writeUsers(users);
        fsControl.writeTweets(tweets);
        return res.status(200).json({user});
    }else {
        return res.status(400).send('This username do not exist.');
    }
}

module.exports = {
    getUsers,
    getUser,
    postUser,
    patchUser,
    delUser
}