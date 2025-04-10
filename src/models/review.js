const mongoose = require('mongoose');

let reviewScheme = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinationID: { type: mongoose.Types.ObjectId, ref: 'Destination', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, required: true },
    // will be created automatically
    createdAt: { type: Date, default: Date.now }
})

let Review = mongoose.model('Review', reviewScheme)
module.exports.Review = Review