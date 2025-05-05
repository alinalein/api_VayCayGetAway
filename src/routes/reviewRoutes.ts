import express from 'express'
const router = express.Router()
import jwtAuth from '../middlewares/auth'
import reviewController from '../controllers/reviewController'
const { getAllReviews, createReview, deleteReview, updateReview, getAverageRating } = reviewController

router.get('/reviews', jwtAuth, getAllReviews)

router.post('/writeReview/:destinationId', jwtAuth, createReview)

router.delete('/deleteReview/:reviewId', jwtAuth, deleteReview)

router.put('/updateReview/:reviewId', jwtAuth, updateReview)

router.get('/rating/:destinationId', jwtAuth, getAverageRating)

export default router;