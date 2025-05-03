import express from 'express';
const app = express();
import path from 'path';
import logger from './utils/logger';
// import appliedCors from './config/cors';

import './passport/passportJwT';// register Strategies globaly 
import './passport/passportLocal';
import './passport/passportGoogle';

import authRoutes from './routes/authRoutes';
import destinationRoutes from './routes/destinationRoutes';
import userRoutes from './routes/userRoutes';
import reviewRoutes from './routes/reviewRoutes';

// app.use(appliedCors); should always be called before the routes 
app.use(logger); //applies logger middleware to all route calls

// express.static -> automatically routes all requests for static files (html) to their corresponding files within a certain folder on the server 
app.use(express.static(path.join(__dirname, '..', 'docs')));

app.use(express.json()); // Middleware to parse incoming JSON requests body(string -> JS object) 
// order matters , if import the routes before , the request body string will not be parsed proper to JS object 

app.use(authRoutes);
app.use(destinationRoutes);
app.use(userRoutes);
app.use(reviewRoutes);
// app.use('/api/users', userRoutes); // sets prefix for the user routes too 

export default app;