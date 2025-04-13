const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateJWTToken = require('../utils/jwt');

router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
            return res.status(400).json({
                message: 'Could not log in',
                // username: user.username,
                user: user
            })
        }
        req.login(user, { session: false }, error => {
            if (error) {
                res.status(400).send(`Error occured while logging in: ${error}`)
            }
            // toJSON is only for mongose object not needed for Postgres
            let token = generateJWTToken(user);
            let responseUser = {
                username: user.username,
                email: user.email,
                birthday: user.birthday,
                favoriteDestinations: user.favoriteDestinations
            }
            return res.status(201).json({
                message: 'user logged in',
                responseUser, token
            })
        })
    })(req, res)
})

module.exports = router;