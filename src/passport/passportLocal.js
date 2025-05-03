const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../config/db')
const { validatePassword } = require('../utils/validateANDhash')

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
                const user = await prisma.users.findUnique({ where: { username: username } });

                if (!user) {
                    console.log('username does not exists');
                    return done(null, false, {
                        message: 'Wrong password or username'
                    });
                }
                const isValid = validatePassword(password, user.password);
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
