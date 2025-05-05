import { validationResult } from 'express-validator'
import { Request, Response } from 'express';

const validationErrors = (req: Request, res: Response): boolean => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        // validationErrors is an object -what JSON sends & .array() extracts the readable list of issues
        res.status(422).json({ errors: errors.array() });
        return true;
    }
    return false;
}
export default validationErrors;