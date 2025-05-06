// Extended interface to allow access to req.user injected by authentication middleware -otherwise cant recognize the user id from token

import { Request } from 'express';

// modifies global types used in your project
declare global {
    // extend the Express namespace, which exists in the @types/express package.
    namespace Express {
        // Define what a User object looks like when it’s attached to the req.user property.
        interface User {
            id: number;
            username: string;
        }

        // Extend the Request object to include the optional user property with the shape defined above
        interface Request {
            user?: User;
        }
    }
}
