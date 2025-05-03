const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = require('../config/db')

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // store later the name of the sectret in env file ->process.env.JWT_SECRET  / in env JWT_SECRET=my_super_secret_key_123
        secretOrKey: 'the_jwt_secret' || process.env.JWT
    }, async (jwtPayload, done) => {
        try {
            // as set _id to id in jws.js
            const user = await prisma.users.findUnique({ where: { id: jwtPayload.id } })
            return done(null, user || false)  // false if no user found
        } catch (error) {
            console.error('Error during JWT verification:', error);
            return done(error, false);
        }
    }));