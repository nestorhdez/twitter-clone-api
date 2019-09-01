const usersModel = require('../users/users-model');
const authJWT = require("../helpers/jwt");

const responseToken = (user) => {
    let dataToken = authJWT.createToken(user);
    let userResponse = {
        access_token: dataToken[0],
        refresh_token: authJWT.createRefreshToken(user),
        expires_in: dataToken[1],
        role: user.role
    };
    return userResponse;
}

const signUp = (req, res) => {
    req.body.role = 'ROLE_USER';
    usersModel.create(req.body)
        .then(user => res.status(200).send(responseToken(user)))
        .catch(err => res.status(400).send(err));
}

const logIn = (req, res) => {
    if (req.body.password && req.body.email) {
        usersModel.findOne({
                email: req.body.email
            })
            .select("_id password")
            .exec((err, userResult) => {
                if (err) {
                    return res.status(401).send({ error: "LoginError" });
                }else if(!userResult) {
                    return res.status(400).json({error: "This user doesn't exists."})
                }
                userResult.comparePassword(req.body.password, userResult.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        return res.status(200).send(responseToken(userResult))
                    } else {
                        return res.status(401).send({ error: "LoginError" });
                    }
                });

            });
    } else {
        return res.status(401).send({ error: "BadRequest" });
    }
}

module.exports = {
    signUp,
    logIn
}