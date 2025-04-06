const mongoose = require('mongoose')

// check later if connectin works !!
const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/VayCay')
        console.log('connected to DB')
    } catch (error) {
        console.error('Could not connect to DB', error)
        process.exit(1);
    }
}

module.exports = connectToDB;