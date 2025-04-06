const express = require('express');
const router = express.Router(); // Creates a new router -> what allows to define routes 
const { Destination } = require('../models/destination');

router.get('/', (req, res) => res.json({ message: 'API is working!' }));

router.get('/destinations', async (req, res) => {
    try {
        const destinations = await Destination.find()
        res.status(200).json(destinations)
    } catch (error) {
        console.error(error);
        res.status(400).send('Error occured fetching destinations', error)
    }
})

module.exports = router; // exports router object that contains all routes that been created in file
