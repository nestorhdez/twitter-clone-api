const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        lowercase: true,
        validate: {
            validator: (val) => val != '' ? true : false
        }
    },
    email: {
        type: String,
        require: true,
        unique: [true, 'This email '],
        validate: {
            validator: (val) => {
                let reg = re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return reg.test(val);
            }
        }
    },
    tweets: {
        default : [],
        type : [String]
    },
    following: {
        default : [],
        type : [String]
    },
    followers: {
        default : [],
        type : [String]
    },
    createdDate: {
        type: Number,
        require: true
    }
});

const user = mongoose.model('user', userSchema);

module.exports = user;