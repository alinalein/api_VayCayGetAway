const express = require('express')
const path = require('path');
const app = express();  // Creates the Express app
const logger = require('./utils/logger');
const appliedCors = require('./config/cors')

require('../src/config/passport') // register LocalStrategy & JwtStrategy globaly 

// app.use(appliedCors); should always be called before the routes 

app.use(logger); //applies logger middleware to all route calls

// express.static -> automatically routes all requests for static files (html) to their corresponding files within a certain folder on the server 
app.use(express.static(path.join(__dirname, '..', 'docs')));

app.use(express.json()); // Middleware to parse incoming JSON requests body(string -> JS object) 
// order matters , if import the routes before , the request body string will not be parsed proper to JS object 

app.use(require('./routes/authRoutes'))
app.use(require('./routes/destinationRoutes'))
app.use(require('./routes/userRoutes'))
app.use(require('./routes/reviewRoutes'))
// app.use('/api/users', userRoutes); // sets prefix for the user routes too 

module.exports = app;
