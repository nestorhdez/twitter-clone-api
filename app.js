const express = require('express');
const app = express();
const cors = require('cors')

// Middlewares. Si no el body llega vacio.
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

// Routing 
const authRouter = require('./app/auth/auth-routes');
const usersRouter = require('./app/users/users-routes');
const tweetsRouter = require('./app/tweets/tweets-routes');

app.use('/twitter', authRouter)
app.use('/twitter/users', usersRouter);
app.use('/twitter/tweets', tweetsRouter);

module.exports = app