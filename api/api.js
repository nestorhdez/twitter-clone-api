const express = require('express');
const mongoose = require('mongoose');

// Constants
const PORT = 5000;
const HOST = '0.0.0.0';

// App
const app = express();
// Middlewares. Si no el body llega vacio.
app.use(express.json());

// Resources routers 
const usersRouter = require('./users/users');
const tweetsRouter = require('./tweets/tweets');

app.use('/twitter/users', usersRouter);
app.use('/twitter/tweets', tweetsRouter);

mongoose.connect('mongodb://localhost:27017/twitter', {useNewUrlParser: true, useCreateIndex: true});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);