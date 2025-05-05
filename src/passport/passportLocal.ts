import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from '../config/db'
import { users } from '@prisma/client';
import validateANDhash from '../utils/validateANDhash'
const validatePassword = validateANDhash.validatePassword

// ckecks username & password that is send by front end client with the DB 
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username: string, password: string, done): Promise<void> => {
            //console.log(`${username} ${password}`);
            try {
                const user: users | null = await prisma.users.findUnique({ where: { username: username } });

                if (!user) {
                    console.log('username does not exists');
                    return done(null, false, {
                        message: 'Wrong password or username'
                    });
                }
                const isValid = validatePassword(password, user.password || '');
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
                    return done(error instanceof Error ? error : new Error(String(error)));
                }
            }
        }
    )
)
