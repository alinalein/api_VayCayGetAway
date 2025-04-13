const express = require('express')
const router = express.Router()
const jwt = require('../middlewares/auth')
const { getAllReviews, createReview, deleteReview, updateReview, getAverageRating } = require('../controllers/reviewController')

router.get('/reviews', jwt, getAllReviews)

router.post('/writeReview/:destinationId', jwt, createReview)

router.delete('/deleteReview/:reviewId', jwt, deleteReview)

router.put('/updateReview/:reviewId', jwt, updateReview)

router.get('/rating/:destinationId', jwt, getAverageRating)

module.exports = router;