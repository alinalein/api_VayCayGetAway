const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport');
const prisma = require('../config/db')

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await prisma.users.findUnique({ where: { googleId: profile.id } });
            if (!user) {
                user = await prisma.users.create({
                    data: {
                        username: profile.displayName,
                        googleId: profile.id,
                        email: profile.emails[0].value
                    }
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));