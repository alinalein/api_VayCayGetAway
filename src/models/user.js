const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: { type: Date, required: true },
    favoriteDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    visitedDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }]
})

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

let User = mongoose.model('User', userSchema);
module.exports.User = User;