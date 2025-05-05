import { CustomValidator } from 'express-validator'
import { reviews } from '@prisma/client';
// value needed, otherwise cant recognize body 
// prefix with _ -> It's a convention that signals to other developers (and linters) that:  "Yes, I know this parameter exists" / "No, I'm not using it"

const validateReviewInput: CustomValidator = (_value, { req }) => {
    // CustomValidator expects a function like::
    // (value: any, meta: ValidationMeta) => boolean | Promise<boolean>
    // So value must be there — but you're not using it, because you're validating based on req.body, not the specific value.

    const { rating, comment } = req.body as reviews;
    if (!rating && !comment) {
        throw new Error('You must provide at least a rating or a comment.');
    }
    return true;
};

export default validateReviewInput;