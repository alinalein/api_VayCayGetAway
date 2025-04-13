const bcrypt = require('bcrypt')

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

const validatePassword = function (password, hashedPasswordFromDB) {
    return bcrypt.compareSync(password, hashedPasswordFromDB)
}
module.exports = { hashPassword, validatePassword }