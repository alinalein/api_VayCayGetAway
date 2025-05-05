import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import passport from 'passport'
import prisma from '../config/db'
import { VerifyCallback } from 'passport-oauth2';

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/callback',
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> => {
        try {
            let user = await prisma.users.findUnique({
                where: { googleId: profile.id }
            });
            if (!user) {
                user = await prisma.users.create({
                    data: {
                        username: profile.displayName,
                        googleId: profile.id,
                        // if email is null / undefined fall to empty string ?? '' 
                        email: profile.emails?.[0]?.value ?? '',
                    }
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err instanceof Error ? err : new Error(String(err)), false);
        }
    }));