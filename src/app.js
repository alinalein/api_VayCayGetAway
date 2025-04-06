const express = require('express'),
    path = require('path'),
    app = express();  // Creates the Express app
// const userRoutes = require('./routes/routes');
const logger = require('./utils/logger');

app.use(logger); //applies logger middleware to all route calls

// express.static -> automatically routes all requests for static files (html) to their corresponding files within a certain folder on the server 
app.use(express.static(path.join(__dirname, '..', 'docs')));

app.use(express.json()); // Middleware to parse incoming JSON requests body(string -> JS object) 
// order matters , if import the routes before , the request body will not be parsed proper to JS object 

app.use(require('./routes/destinationRoutes'))
// app.use('/api/users', userRoutes); // sets prefix for the user routes too 

module.exports = app;
