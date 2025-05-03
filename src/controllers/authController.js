const passport = require('passport');
const generateJWTToken = require('../utils/jwt');

const loginUserJwT = (req, res, next) => {
    passport.authenticate('local', { session: false }, (error, user) => {
        if (error || !user) {
            return res.status(400).json({
                message: 'Could not log in',
                // username: user.username,
                user
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(400).send(`Login error: ${err}`);
            }

            // toJSON is only for mongose object not needed for Postgres
            const token = generateJWTToken(user);
            const responseUser = {
                username: user.username,
                email: user.email,
                birthday: user.birthday,
            };

            return res.status(201).json({ message: 'user logged in', responseUser, token });
        });
    })(req, res, next);
};

const loginGoogleStart = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })
        (req, res, next);
}

const loginGoogleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {

        if (err || !user) {
            return res.status(401).json({ message: 'Authentication failed', user })
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(400).send(`Login error: ${err}`)
            }
            const token = generateJWTToken(user)

            const responseUser = {
                id: user.id,
                username: user.username,
                email: user.email,
            };
            // Respond with token for frontend/mobile/HTTP client
            return res.status(200).json({
                message: 'OAuth login successful',
                token,
                responseUser
            });
        })
    })(req, res, next);
}

module.exports = { loginUserJwT, loginGoogleStart, loginGoogleCallback }