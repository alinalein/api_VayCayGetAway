const express = require('express')
const router = express.Router()
const Reviews = require('../models/reviews').Review
const jwt = require('../middlewares/auth')

router.get('/reviews', jwt, async (req, res) => {
    try {
        const reviews = await Reviews.find()
        return res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        return res.status(500).send(`Erro ${error} occired while fetching reviews`)
    }
})

