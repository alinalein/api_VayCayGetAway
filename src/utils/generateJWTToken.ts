import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'the_jwt_secret'
if (!jwtSecret) {
    throw new Error('JWT secret is not defined in environment variables.');
}

interface JwtUserPayload {
    id: number;
    username: string;
}

let generateJWTToken = (user: JwtUserPayload) => {
    // jwt.sign(payload, secretKey, options)
    return jwt.sign({
        id: user.id,
        username: user.username
    },
        jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    })
}

export default generateJWTToken