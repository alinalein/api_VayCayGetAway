const express = require('express')
const router = express.Router()
const Reviews = require('../models/reviews').Review
const jwt = require('../middlewares/auth')
const { body } = require('express-validator')
const { compare } = require('bcrypt')

router.get('/reviews', jwt, async (req, res) => {
    try {
        const reviews = await Reviews.find()
        return res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        return res.status(500).send(`Erro ${error} occired while fetching reviews`)
    }
})

router.post('/writeReview/:destinationId', jwt, async (req, res) => {
    try {
        // const userId = req.user?._id; -> object / const userId = req.user?.id; -> string
        const userId = req.user?.id
        const review = await Reviews.create({
            userID: userId,
            destinationID: req.params.destinationId,
            rating: req.body.rating,
            comment: req.body.comment,
        })

        return res.status(200).json(
            {
                message: 'review created',
                review
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(`Error ${error} occured while creating review`)
    }
})

router.delete('/deleteReview/:reviewId', jwt, async (req, res) => {
    try {
        const userId = req.user?.id

        const review = await Reviews.findOne({
            _id: req.params.reviewId
        })

        if (!review) {
            return res.status(400).send('Not found')
        }
        if (userId !== String(review.userID)) {
            return res.status(403).send('You can only delete your comments')
        }

        const deletedReview = await Reviews.findOneAndDelete({
            // only delete if review id and user id of comment match the id in param and user id in token 
            _id: req.params.reviewId,
            userID: userId
        })

        return res.status(200).send('Review deleted')

    } catch (error) {
        console.error(error)
        return res.status(500).send(`Error ${error} occured while deleting review`)
    }
})

router.put('/updateReview/:reviewId', jwt, async (req, res) => {
    try {
        const userId = req.user?.id

        const updatedReview = await Reviews.findOneAndUpdate(
            {
                _id: req.params.reviewId,
                userID: userId
            },
            {
                rating: req.body.rating,
                comment: req.body.comment
            },
            { new: true }
        )

        return res.status(200).json({
            rating: updatedReview.rating,
            comment: updatedReview.comment
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send(`Error ${error} occured while updating review`)
    }
})

router.get('/rating/:destinationId', jwt, async (req, res) => {
    try {
        const destinationRatings = await Reviews.find({ destinationID: req.params.destinationId }, 'rating')
        if (!destinationRatings) {
            return res.status(400).send('Could not fetch ratings ')
        }
        const ratings = destinationRatings.map(dest => dest.rating)

        const avarageRating = ratings.length ?
            ratings.reduce((a, b) => a + b, 0) / ratings.length
            : NaN;

        return res.status(200).json(avarageRating)

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error occured fetching ratings', error)
    }
})

module.exports = router;