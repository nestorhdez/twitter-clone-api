const follow = (userWhoF, userToF) => {
    userWhoF.following.push(userToF.username);
    userToF.followers.push(userWhoF.username);
    userToF.save().then(()=>{}).catch(err => console.error(`Error saving ${userToF.username} followers updating. Error: ${err}`));
    return userWhoF.save()
}

const unfollow = (userWhoF, userToF) => {
    userWhoF.following = userWhoF.following.filter(user => user != userToF.username);
    userToF.followers = userToF.followers.filter(user => user != userWhoF.username);
    userToF.save().then(() => {}).catch(err => console.error(`Error saving ${userToF.username} followers updating. Error: ${err}`))
    return userWhoF.save()
}

module.exports = {
    follow,
    unfollow
}