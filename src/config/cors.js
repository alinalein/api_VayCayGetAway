const cors = require('cors');

const allowedURLs = [
    'http://localhost:8080',
    '',
    ''
]
const corsResponse = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin);

        if (!isAllowed) {
            const message = `CORS policy: The origin "${origin}" is not allowed.`
            return callback(new Error(message), false)
        }
        return callback(null, true)
    }
}
const appliedCors = cors(corsResponse);
module.exports = appliedCors