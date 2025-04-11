// value needed, otherwise cant recognize body 
const validateReviewInput = (value, { req }) => {
    if (!req.body.rating && !req.body.comment) {
        throw new Error('You must provide at least a rating or a comment.');
    }
    return true;
};

module.exports = validateReviewInput