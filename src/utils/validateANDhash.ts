import bcrypt from 'bcrypt';

const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10)
}

const validatePassword = function (password: string, hashedPasswordFromDB: string): boolean {
    return bcrypt.compareSync(password, hashedPasswordFromDB)
}
export default { hashPassword, validatePassword }