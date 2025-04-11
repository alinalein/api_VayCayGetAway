const { body, validationResult } = require('express-validator')
const passport = require('passport')
const Users = require('../models/user').User
const validationErrors = require('../utils/validationErros');

const signUp = [body('username').isAlphanumeric().isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long').matches(/\d/).withMessage('Password must contain at least one number'),
body('email').isEmail().withMessage('Please pick a valid email address'),
body('birthday').isISO8601().toDate().withMessage('Birthday must be a valid date (YYYY-MM-DD)'),
async (req, res) => {
    try {

        if (validationErrors(req, res)) return;

        if (!req.body.username) {
            return res.status(401).send('User required');
        }
        const existingUser = await Users.findOne({ username: req.body.username })
        if (existingUser) {
            return res.status(403).send(`Username ${req.body.username} already exists, please pick another one`)
        } else {
            try {
                const hashedPassword = Users.hashPassword(req.body.password)
                const newUser = await Users.create({
                    username: req.body.username,
                    password: hashedPassword,
                    email: req.body.email,
                    birthday: req.body.birthday
                })
                return res.status(200).json({
                    status: 'sign up successful',
                    username: newUser.username,
                    email: newUser.email,
                    birthday: newUser.birthday
                });
            } catch (error) {
                return res.status(400).send(`Profile could not be created: ${error} `)
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(`An unknown ${error} occured`)
    }
}]

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await Users.find()
        return res.status(200).json(allUsers)
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`could not get all users ${error}`)
    }
}
const deleteProfie = async (req, res) => {
    try {
        const userId = req.user?.id

        const deletedUser = await Users.deleteOne({ _id: userId })
        return res.status(200).send(`Profile deleted successful`)
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`Profile couldn't be deleted, error ${error}`)
    }
}

const updateProfile = [body('username').isAlphanumeric().isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
body('email').isEmail().withMessage('Please pick a valid email address'),
body('birthday').isISO8601().toDate().withMessage('Birthday must be a valid date (YYYY-MM-DD)'),
async (req, res) => {
    try {
        if (validationErrors(req, res)) return;

        // try to access user - if user - null - will not crash because of ? 
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).send('You must be logged in for this operation')
        }

        const { username, email, birthday } = req.body;
        if (!username && !email && !birthday) {
            return res.status(400).send('fill out all fields to update the profile ')
        }


        const existingUser = await Users.findOne({ username }) // checks if username in the DB -> yes ->existingUser
        if (existingUser && String(existingUser.id !== userId)) {
            return res.status(401).send(`Username ${existingUser.username} already exists, please pick another one`)
        }
        const updatedUser = await Users.findOneAndUpdate(
            {
                _id: userId
            },
            {
                username: username,
                email: email,
                birthday: birthday
            },
            { new: true }
        )

        return res.status(200).json(updatedUser)
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`Profile couldn't be updated, error ${error}`)
    }
}]

const deleteDestination = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type, destinationId } = req.params
        const validTypes = ['visited', 'favorite']

        if (!validTypes.includes(type)) {
            return res.status(400).send(`Invalid type. Valid typed are ${validTypes}`)
        }

        const updatedField = type === 'visited' ? 'visitedDestinations' : 'favoriteDestinations'

        const isInList = await Users.findOne({
            _id: userId,
            // mongoose interprets it as is id in array?
            [updatedField]: destinationId
        })

        if (!isInList) {
            return res.status(404).send(`No such destination in ${type}`)
        }

        const updatedUser = await Users.findOneAndUpdate(
            { _id: userId },
            { $pull: { [updatedField]: destinationId } },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(500).send(`Destination could not be removed from ${type}`)
        }

        return res.status(200).json({
            message: 'Destination removed from favorites',
            user: updatedUser.username,
            [updatedField]: updatedUser[updatedField]
        })
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`Error ${error} occured while removing destination from favorites`)
    }
}

const addDestination = async (req, res) => {
    try {
        const userId = req.user?.id
        const { destinationId, type } = req.params
        const validTypes = ['visited', 'favorite']

        if (!validTypes.includes(type)) {
            return res.status(400).send(`Invalid type. Allowed types are ${validTypes}`)
        }

        const toUpdateField = type === 'favorite' ? 'favoriteDestinations' : 'visitedDestinations'

        const isInList = await Users.findOne({
            _id: userId,
            // mongoose interprets as is id in array? - if would write just visitedDestinations, would not need to set [] around
            [toUpdateField]: destinationId
        })
        if (isInList) {
            return res.status(409).send(`Destination is already in your ${type} list`)
        }
        const updatedUser = await Users.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { [toUpdateField]: destinationId } },
            { new: true }
        )
        if (!updatedUser) {
            return res.status(500).send(`Could not add destination to ${type} list`)
        }

        return res.status(200).json({
            message: 'Destination added to List',
            user: updatedUser.username,
            [toUpdateField]: updatedUser[toUpdateField]
        })

    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`Error ${error} occured while removing adding to favorites`)
    }
}
const changePasswordJWT = [body('newPassword').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long').matches(/\d/).withMessage('Password must contain at least one number'),
async (req, res) => {
    try {
        if (validationErrors(req, res)) return;

        const userId = req.user?.id
        const existingUser = await Users.findOne({ _id: userId })
        const passwordCheck = existingUser.validatePassword(req.body.password)

        if (!passwordCheck) {
            return res.status(403).send('Please type your current password to change it to a new password')
        }

        const newPassword = await Users.hashPassword(req.body.newPassword)
        const updatedPassword = await Users.findOneAndUpdate({ _id: userId }, {
            password: newPassword
        },
            { new: true }
        )
        return res.status(200).send(`Password changed successfull for ${existingUser.username}`)
    } catch (error) {
        console.error(error)
        return res.status(500).send(`Error ${error} occured while changing the password`)
    }
}]

module.exports = {
    signUp,
    addDestination,
    deleteDestination,
    updateProfile,
    deleteProfie,
    getAllUsers,
    changePasswordJWT
}