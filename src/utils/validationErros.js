const { validationResult } = require('express-validator');

const validationErrors = (req, res) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        // validationErrors is an object -what JSON sends & .array() extracts the readable list of issues
        res.status(422).json({ error: error.array() });
        return true;
    }
    return false;
}
module.exports = validationErrors