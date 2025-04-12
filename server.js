require('dotenv').config() // allows to load data from env needed for DB, for all over the app, globally  
// const app = require('./src/app');
const connectToDB = require('./src/config/db');
const port = process.env.PORT || 8080;

connectToDB(); // Connect to MongoDB

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
});
