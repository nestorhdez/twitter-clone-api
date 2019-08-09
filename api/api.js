const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
// Middlewares. Si no el body llega vacio.
app.use(express.json());

// Resources routers 
const usersRouter = require('./users/users');
const tweetsRouter = require('./tweets/tweets');

app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);