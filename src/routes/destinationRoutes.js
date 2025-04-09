const express = require('express');
const router = express.Router(); // Creates a new router -> what allows to define routes 
const jwt = require('../middlewares/auth');
const e = require('express');
const Destinations = require('../models/destination').Destination;

router.get('/', (req, res) => res.json({ message: 'API is working!' }));

router.get('/destinations', jwt, async (req, res) => {
    try {
        const destinations = await Destinations.find()
        res.status(200).json(destinations)
    } catch (error) {
        console.error(error);
        res.status(400).send('Error occured fetching destinations', error)
    }
})

router.get('/destination/:id', jwt, async (req, res) => {
    try {
        const destination = await Destinations.findOne({ _id: req.params.id })
        return res.status(200).json(destination)
    } catch (error) {
        console.error(error);
        return res.status(400).send('Error occured fetching destinations', error)
    }
})

router.get('/tags', jwt, async (req, res) => {
    try {
        // fetch only tags field, all arrays from destinations with tags
        // {} all documents -> 'tags' from all documents only the tags field
        const destinationTags = await Destinations.find({}, 'tags')
        if (!destinationTags || destinationTags.length === 0) {
            return res.status(500).send('')
        }

        // flatMap -> maps through arrays and flatten : [["a", "b"], ["c", "d"]] ->["a", "b", "c", "d"]
        const allTags = destinationTags.flatMap(dest => dest.tags)

        // Set is a built-in JavaScript object that only stores unique values.
        // [...new Set(array)] -> turn array into a Set (removing duplicates) -> spread operator (...) to convert it back into a normal array
        const uniqueTags = [...new Set(allTags)]

        return res.status(200).json(uniqueTags)

    } catch (error) {
        console.error(error)
        return res.status(500).send(`Error ${error} occured while fetching the tags`)
    }
})

module.exports = router; // exports router object that contains all routes that been created in file
