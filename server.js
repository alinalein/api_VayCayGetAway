const app = require('./src/app');
const connectToDB = require('./src/config/db');
// Tries to use a port from the environment variables (like heroku), if not set , fallback to 8080
const port = process.env.PORT || 8080; // as 3000 often used by font end 

connectToDB(); // Connect to MongoDB

// 0000 allows to acces app from other IPs than only my laptop, like phone or heroku
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
});
