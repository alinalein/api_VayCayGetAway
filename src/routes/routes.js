const express = require('express');
const router = express.Router(); // Creates a new router

router.get('/', (req, res) => res.json({ message: 'API is working!' }));

module.exports = router; 
