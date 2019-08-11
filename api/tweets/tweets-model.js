const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 250,
        validate: {
            validator: (val) => val != '' ? true : false
        } 
    },
    owner: {
        type: String,
        required: true
    },
    createdDate: {
        type: Number,
        require: true
    }
});

const tweet = mongoose.model('tweet', tweetSchema);
module.exports = tweet;