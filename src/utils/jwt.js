const jwt = require('jsonwebtoken')
const jwtSecret = 'the_jwt_secret' || process.env.JWT

let generateJWTToken = (user) => {
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

module.exports = generateJWTToken