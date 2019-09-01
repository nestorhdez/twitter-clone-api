const usersModel = require('./users-model');
const tweetsModel = require('../tweets/tweets-model');
const tools = require('./users-tools');

const getUsers = (req, res) => {
    return usersModel.find().sort({createdDate: req.query.order})
        .then(allUsers => res.json(allUsers))
        .catch(err => res.status(400).json(err));
}

const getUser = (req, res) => {
    const username = req.params.username.toLowerCase();
    return usersModel.findOne({"username": username}, (err, user) => {
        if(user){
            return res.status(200).json(user);
        }else {
            return res.status(400).send('This user do not exists.');
        }
    });
}

const editUser = (req, res) => {
    let username = req.params.username;
    if(req.user.username != username){
        return res.status(400).send(`${req.user.username} cannot edit ${req.params.username}.`);
    }
    let update = {};
    req.body.name != undefined ? update.name = req.body.name : '';
    req.body.email != undefined ? update.email = req.body.email : '';

    return usersModel.findOneAndUpdate({username}, update)
        .then(() => {
            update.username = username;
            return res.json(update);
        })
        .catch(err => res.status(400).json(err));
}

const followUser = (req, res) => {
    let userWhoFollow = req.query.username;
    let userToFollow = req.params.username;
    let followAction = +req.query.follow;
    if(req.user.username != userWhoFollow){
        return res.status(400).send(`${req.user.username} cannot follow for ${userWhoFollow}'s account.`)
    }
    return usersModel.findOne({"username": userToFollow}, (err, userToF) => {
        if(err){
            return res.status(404).json(err);
        }else if(userToF) {
            return usersModel.findOne({ "username": userWhoFollow}, (err,  userWhoF) => {
                if(err) {
                    return res.status(400).json(err);
                }if(userWhoF){
                    if(followAction){
                        return tools.follow(userWhoF, userToF)
                        .then(() => res.send(`${userWhoF.username} has successfully start following ${userToF.username}.`))
                        .catch(err => res.status(404).json(err));
                    }else {
                        return tools.unfollow(userWhoF, userToF)
                        .then(() => res.send(`${userWhoF.username} has succsesfully stop following ${userToF.username}.`))
                        .catch(err => res.status(400).json(err));
                    }
                }else {
                    return res.status(400).send(`This user do not exist: ${userWhoFollow}`);                    
                }
            });
        }else {
            return res.status(400).send(`The user to follow do not exist: ${userToF}`);
        }
    });
}

const delUser = (req, res) => {
    const username = req.params.username;
    if(username != req.user.username){
        return res.status(400).send(`${req.user.username} cannot delete ${username}'s account.`)
    }
    return usersModel.deleteOne({username}, (err, user) => {
        if(err){
            return res.status(404).json(err);
        }else if(user.deletedCount > 0) {
            return tweetsModel.deleteMany({"owner": username})
            .then(() => res.json(`${username} has been successfully deleted.`))
            .catch(err => res.status(400).json(err));
        }else {
            return res.status(400).send('That user could not be deleted.');
        } 
    });
}

module.exports = {
    getUsers,
    getUser,
    editUser,
    followUser,
    delUser
}