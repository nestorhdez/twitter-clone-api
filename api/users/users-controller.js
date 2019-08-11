const usersModel = require('./users-model');
const tweetsModel = require('../tweets/tweets-model');

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

const postUser = (req, res) => {
    let newUser = new usersModel(req.body);
    newUser.createdDate = Date.now();
    return newUser.save()
        .then(() =>  res.json(newUser))
        .catch(err => res.status(400).json(err));
}

const patchUser = (req, res) => {
    let username = req.params.username;
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

const delUser = (req, res) => {
    const username = req.params.username;
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
    postUser,
    patchUser,
    delUser
}