import cors, { CorsOptions } from 'cors'

const allowedURLs: string[] = [
    'http://localhost:8080',
    'http://localhost:5173',
    ''
]
const corsResponse: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isAllowed = allowedURLs.includes(origin);

        if (!isAllowed) {
            const message = `CORS policy: The origin "${origin}" is not allowed.`
            return callback(new Error(message), false)
        }
        return callback(null, true)
    }
}
const appliedCors = cors(corsResponse);

export default appliedCors; 