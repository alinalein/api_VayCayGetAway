const { body } = require('express-validator');
const Reviews = require('../models/review').Review
const checkForProfanity = require('../utils/profanityValidator');
const validateReviewInput = require('../utils/validateReviewInput');
const validationErrors = require('../utils/validationErros');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Reviews.find()
        return res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        return res.status(500).send(`Erro ${error} occired while fetching reviews`)
    }
}

const createReview = [body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
body('comment').optional().trim().escape().isLength({ min: 2 }).withMessage('Comment must be at least 2 characters long.').custom(checkForProfanity),
body().custom(validateReviewInput),

async (req, res) => {
    try {
        if (validationErrors(req, res)) return; //without return function will be called multiple times - tries to send response multiple times

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
                username: req.user.username,
                message: 'review created',
                review
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(`Error ${error} occured while creating review`)
    }
}]

const deleteReview = async (req, res) => {
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
}

const updateReview = [body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
body('comment').optional().trim().escape().isLength({ min: 2 }).withMessage('Comment must be at least 2 characters long.').custom(value => checkForProfanity(value)),
body().custom(validateReviewInput),
async (req, res) => {
    try {
        if (validationErrors(req, res)) return;

        const userId = req.user?.id //(string from JWT)

        const review = await Reviews.findOne({
            _id: req.params.reviewId
        })

        if (!review) {
            return res.status(400).send('Not found')
        }

        if (userId !== String(review.userID)) {
            return res.status(403).send('You can only delete your comments')
        }

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
}]

const getAverageRating = async (req, res) => {
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
}

module.exports = {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    getAverageRating
}