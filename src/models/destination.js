const mongoose = require('mongoose');

let destinationSchema = mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    imageURL: { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },
    averageCostPerDayInEUR: { type: Number, required: true },
    tags: { type: [String], required: true },
    thingsToDo: { type: [String], required: true }
})

// Destination name of the model will use in your code.
// travelDestinations -> the name of the collection in the database 
let Destination = mongoose.model('Destination', destinationSchema, 'travelDestinations')
module.exports.Destination = Destination;