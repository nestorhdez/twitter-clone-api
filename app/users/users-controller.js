const usersModel = require('./users-model');
const tweetsModel = require('../tweets/tweets-model');

const getUsers = (req, res) => {
    return usersModel.find().sort({createdDate: req.query.order})
        .then(allUsers => res.json(allUsers))
        .catch(err => res.status(400).json(err));
}

const getUser = (req, res) => {
    const username = req.params.username ? req.params.username.toLowerCase() : req.user.username;
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
    if(req.user.username != userWhoFollow){
        return res.status(400).send(`${req.user.username} cannot follow for ${userWhoFollow}'s account.`)
    }
    const whoFollow = usersModel.updateOne({username: userWhoFollow}, {$push : {following: userToFollow}}, {new: true})
    const toFollow = usersModel.updateOne({username: userToFollow}, {$push : {followers: userWhoFollow}}, {new: true})
    Promise.all([whoFollow, toFollow])
        .then(() => res.status(200).send(`${userWhoFollow} has successfully start following ${userToFollow}.`))
        .catch(err => {
            console.log(err)
            return res.status(404).json({Error: err})
        })

}

const unfollowUser = (req, res) => {
    let userWhoUnfollow = req.query.username;
    let userToUnfollow = req.params.username;
    if(req.user.username != userWhoUnfollow){
        return res.status(400).send(`${req.user.username} cannot follow for ${userWhoUnfollow}'s account.`)
    }
    const whoUnfollow = usersModel.updateOne({username: userWhoUnfollow}, {$pull : {following: userToUnfollow}})
    const toUnfollow = usersModel.updateOne({username: userToUnfollow}, {$pull : {followers: userWhoUnfollow}})
    Promise.all([whoUnfollow, toUnfollow])
        .then(() => res.status(200).send(`${userWhoUnfollow} has succsesfully stop following ${userToUnfollow}.`))
        .catch(err => {
            console.log(err)
            return res.status(404).json({Error: err})
        })
}

const delUser = (req, res) => {
    const username = req.params.username;
    if(username != req.user.username){
        return res.status(400).send(`${req.user.username} cannot delete ${username}'s account.`)
    }
    return usersModel.findOneAndDelete({username}, (err, user) => {
        if(err){
            return res.status(404).json(err);
        }else if(user) {
            const updateFollowing = usersModel.updateMany({username: {$in: user.following} }, {$pull: {followers: username}}, {new: true})
            const updateFollowers = usersModel.updateMany({username: {$in: user.followers} }, {$pull: {following: username}}, {new: true})
            const tweets = tweetsModel.deleteMany({"owner": username})

            Promise.all([updateFollowing, updateFollowers, tweets])
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
    unfollowUser,
    delUser
}