import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import prisma from '../config/db'
import { users } from '@prisma/client';

interface JwtPayload {
    id: number;
    username: string;
}

// Define the options for the strategy
const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // store later the name of the sectret in env file ->process.env.JWT_SECRET  / in env JWT_SECRET=my_super_secret_key_123
    secretOrKey: process.env.JWT_SECRET || 'the_jwt_secret',
};

passport.use(
    new JwtStrategy(opts, async (jwtPayload: JwtPayload, done: VerifiedCallback): Promise<void> => {
        try {
            // as set _id to id in jws.js
            const user: users | null = await prisma.users.findUnique({ where: { id: jwtPayload.id } })
            return done(null, user || false)  // false if no user found
        } catch (error) {
            console.error('Error during JWT verification:', error);
            return done(error instanceof Error ? error : new Error(String(error)), false);
        }
    }));