import passport from 'passport'
import { RequestHandler } from 'express'; // Type for middleware functions

const jwtAuth: RequestHandler = passport.authenticate('jwt', { session: false })

export default jwtAuth