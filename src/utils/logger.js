const fs = require('fs'),
    morgan = require('morgan'),
    path = require('path');

//  '..', '..', 'logs', 'log.txt' - so file created and logs in logs folder 
const accessLogStream = fs.createWriteStream(path.join(__dirname, '..', '..', 'logs', 'log.txt'), { flags: 'a' })
//common parameter specifies that requests should be logged using Morgan’s “common” format,
const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger; // exports const logger
