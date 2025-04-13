const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/auth');
const { getAllDestinations, getDestinationById, getUniqueTags } = require('../controllers/destinationController');

router.get('/', (req, res) => res.json({ message: 'API is working!' }));

router.get('/destinations', jwt, getAllDestinations);

router.get('/destinations/:id', jwt, getDestinationById);

router.get('/tags', jwt, getUniqueTags);

module.exports = router;