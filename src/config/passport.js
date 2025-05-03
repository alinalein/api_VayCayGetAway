const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const passportJWT = require('passport-jwt');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const Users = require('../models/user').User;

// ckecks username & password that is send by front end client with the BD 
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            //console.log(`${username} ${password}`);
            try {
                const user = await Users.findOne({ username: username });

                if (!user) {
                    console.log('username does not exists');
                    return done(null, false, {
                        message: 'Wrong password or username'
                    });
                }
                const isValid = user.validatePassword(password);
                if (!isValid) {
                    console.log('Incorrect password');
                    return done(null, false, { message: 'Wrong password or username' });
                }

                // If everything is good - all checks passed 
                console.log('Identification successful');
                return done(null, user);

            } catch (error) {
                if (error) {
                    console.error('Error during login:', error);
                    return done(error);
                }
            }
        }
    )
)

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // store later the name of the sectret in env file ->process.env.JWT_SECRET  / in env JWT_SECRET=my_super_secret_key_123
        secretOrKey: 'the_jwt_secret' || process.env.JWT
    }, async (jwtPayload, done) => {
        try {
            // as set _id to id in jws.js
            const user = await Users.findById(jwtPayload.id)
            return done(null, user || false)  // false if no user found
        } catch (error) {
            console.error('Error during JWT verification:', error);
            return done(error, false);
        }
    }));