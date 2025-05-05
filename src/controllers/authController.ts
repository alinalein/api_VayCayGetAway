import passport from 'passport'
import generateJWTToken from '../utils/generateJWTToken'
import { Request, Response, NextFunction } from 'express';
import { users } from '@prisma/client';

const loginUserJwT = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('local', { session: false }, (error: unknown, user: users | false) => {
        if (error || !user) {
            return res.status(400).json({
                message: 'Could not log in',
                // username: user.username,
                user: null
            });
        }

        (req as any).login(user, { session: false }, (err: unknown) => {
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

            return res.status(201).json({
                message: 'user logged in',
                user: responseUser,
                token
            });
        });
    })(req, res, next);
};

const loginGoogleStart =
    // (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('google', { scope: ['profile', 'email'] })
//         (req, res, next);
// }

const loginGoogleCallback = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('google', { session: false }, (err: unknown, user: users | false) => {

        if (err || !user) {
            return res.status(401).json({ message: 'Authentication failed', user })
        }
        (req as any).login(user, { session: false }, (err: unknown) => {
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
                user: responseUser
            });
        })
    })(req, res, next);
}

export default { loginUserJwT, loginGoogleStart, loginGoogleCallback }