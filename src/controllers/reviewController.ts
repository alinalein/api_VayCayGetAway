import { body } from 'express-validator'
import prisma from '../config/db'
import checkForProfanity from '../utils/profanityValidator'
import validateReviewInput from '../utils/validateReviewInput'
import validationErrors from '../utils/validationErros'
import { Request, Response } from 'express'
import { reviews } from '@prisma/client'

// Extended interface to allow access to req.user injected by authentication middleware -otherwise cant recognize the user id from token
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        username: string;
    };
}

const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await prisma.reviews.findMany()
        res.status(200).json(reviews)
    } catch (error) {
        console.error(error instanceof Error ? error.message : error)
        res.status(500).send(`Error: "${error}"coccured while fetching reviews`)
        return
    }
}

const createReview = [
    body('rating')
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating must be a number between 1 and 5'),
    body('comment')
        .optional()
        .trim()
        .escape()
        .isLength({ min: 2 })
        .withMessage('Comment must be at least 2 characters long.')
        .custom(checkForProfanity),
    body()
        .custom(validateReviewInput),

    async (req: Request, res: Response): Promise<void> => {
        try {
            if (validationErrors(req, res)) return; //without return function will be called multiple times - tries to send response multiple times

            // const userId = req.user?._id; -> object / const userId = req.user?.id; -> string
            const userId = (req as AuthenticatedRequest).user?.id;
            const rating = req.body.rating !== undefined ? parseFloat(req.body.rating) : undefined;

            const review = await prisma.reviews.create({
                data: {
                    user_id: userId,
                    destination_id: parseInt(req.params.destinationId),
                    rating,
                    comment: req.body.comment,
                }
            })

            res.status(200).json(
                {
                    message: 'review created',
                    review
                }
            )
        } catch (error) {
            console.error(error instanceof Error ? error.message : error)
            res.status(500).send(`Error: "${error}" occured while creating review`)
        }
    }]

const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;

        const review: reviews | null = await prisma.reviews.findUnique({
            where: { id: parseInt(req.params.reviewId) }
        })

        if (!review) {
            res.status(400).send('Not found')
            return
        }
        if (userId !== review.user_id) {
            res.status(403).send('You can only delete your comments')
            return
        }

        await prisma.reviews.delete({
            // only delete if review id and user id of comment match the id in param and user id in token 
            where: {
                id: parseInt(req.params.reviewId),
                user_id: userId
            }
        })

        res.status(200).send('Review deleted')

    } catch (error) {
        console.error(error instanceof Error ? error.message : error)
        res.status(500).send(`Error: "${error}" occured while deleting review`)
    }
}

const updateReview = [body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),
body('comment')
    .optional()
    .trim()
    .escape().isLength({ min: 2 })
    .withMessage('Comment must be at least 2 characters long.').custom(value => checkForProfanity(value)),
body()
    .custom(validateReviewInput),
async (req: Request, res: Response): Promise<void> => {
    try {
        if (validationErrors(req, res)) return;

        const userId = (req as AuthenticatedRequest).user?.id;

        const review: reviews | null = await prisma.reviews.findUnique({
            where: {
                id: parseInt(req.params.reviewId)
            }
        })


        if (!review) {
            res.status(400).send('Not found')
            return;
        }

        if (userId !== review.user_id) {
            res.status(403).send('You can only delete your comments')
            return
        }

        const updatedReview = await prisma.reviews.update(
            {
                where: {
                    id: parseInt(req.params.reviewId),
                    user_id: userId
                },
                data: {
                    rating: parseInt(req.body.rating),
                    comment: req.body.comment
                }
            }
        )

        res.status(200).json({
            rating: updatedReview?.rating,
            comment: updatedReview?.comment
        })

    } catch (error) {
        console.error(error instanceof Error ? error.message : error)
        res.status(500).send(`Error: "${error}" occured while updating review`)
    }
}]

const getAverageRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const destinationId = parseInt(req.params.destinationId);

        const destinationRatings = await prisma.reviews.findMany({
            where: { destination_id: destinationId },
            // include: { destinations: true }
            select: { rating: true }
        })

        if (!destinationRatings) {
            res.status(400).send('No ratings found for this destination')
            return
        }

        const ratings = destinationRatings.map(dest => dest.rating)

        const validRatings = ratings.filter((r): r is number => typeof r === 'number');

        const avarageRating = validRatings.length ?
            validRatings.reduce((a, b) => a + b, 0) / validRatings.length
            : NaN;

        res.status(200).json({ avarageRating })

    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        res.status(500).send(`Error: "${error}" occured fetching ratings`)
    }
}

export default {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    getAverageRating
}