const usersModel = require('../users/users-model');
const tweetsModel = require('../tweets/tweets-model');

const accentRegex = (string) => {
    return string.replace(/a/g, '[a,á,à,ä]')
       .replace(/e/g, '[e,é,ë]')
       .replace(/i/g, '[i,í,ï]')
       .replace(/o/g, '[o,ó,ö,ò]')
       .replace(/u/g, '[u,ü,ú,ù]');
}

const search = (req, res) => {

    const users = usersModel.find( { username: { $regex: req.query.search, $options: 'i' } } );
    const tweets = tweetsModel.find( { text: { $regex: accentRegex(req.query.search), $options: 'i' } } )
        .sort({createdDate: 'desc'});

    Promise.all([users, tweets])
        .then(([users, tweets]) => res.json({users, tweets}))
        .catch(error => res.status(404).send({error}));
}

module.exports = {
    search
};