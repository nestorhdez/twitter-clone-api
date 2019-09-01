const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const vars = require('../helpers/defaults')

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
        lowercase: true,
        match: [vars.regexEmail],
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        match: [vars.regexPassword],
        select: false,
        required: true
    },
    role: {
        type: String,
        enum: ["ROLE_USER",
            "ROLE_COMPANY",
        ],
        required: true
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


const generateHashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10))
}

// Middleware, antes de guardar encriptar la contraseña
userSchema.pre('save', function(next) {
    try {
        let user = this

        if (!user.isModified('password')) return next();
        user.password = generateHashPassword(user.password)
        next()
    } catch (error) {
        next(error)
    }
})

// Funcion para comprobar la contraseña mediante bcrypt
userSchema.methods.comparePassword = function(candidatePassword, hashPassword, cb) {
    bcrypt.compare(candidatePassword, hashPassword, function(err, isMatch) {
        if (err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('user', userSchema);