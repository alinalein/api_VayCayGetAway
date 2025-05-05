import fs from 'fs'
import morgan from 'morgan'
import path from 'path'

//  '..', '..', 'logs', 'log.txt' - so file created and logs in logs folder 
const logPath = path.join(__dirname, '..', '..', 'logs', 'log.txt');

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(logPath, { flags: 'a' })

//combined parameter specifies that requests should be logged using Morgan’s "combined" format,
const logger = morgan('combined', {
    stream: accessLogStream,
});

export default logger; // exports const logger
