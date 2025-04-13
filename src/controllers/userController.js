const { body, validationResult } = require('express-validator')
const prisma = require('../config/db')
const validationErrors = require('../utils/validationErros');
const { validatePassword, hashPassword } = require('../utils/validateANDhash')

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
        const existingUser = await prisma.users.findUnique({ where: { username: req.body.username } })
        if (existingUser) {
            return res.status(403).send(`Username ${req.body.username} already exists, please pick another one`)
        } else {
            try {
                const hashedPassword = hashPassword(req.body.password)
                const newUser = await prisma.users.create({
                    data: {
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birthday: req.body.birthday
                    }
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
        const allUsers = await prisma.users.findMany()
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

        const deletedUser = await prisma.users.delete({ where: { id: userId } })
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


        const existingUser = await prisma.users.findUnique({ where: { username } }) // checks if username in the DB -> yes ->existingUser
        if (existingUser && String(existingUser.id !== userId)) {
            return res.status(401).send(`Username ${existingUser.username} already exists, please pick another one`)
        }
        const updatedUser = await prisma.users.update(
            {
                where: {
                    id: userId
                },
                data: {
                    username: username,
                    email: email,
                    birthday: birthday
                }
            }
        )

        // takes password out of updatedUser
        const { password, ...safeUser } = updatedUser;
        return res.status(200).json(safeUser)
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

        const updatedField = type === 'visited' ? 'visited_destinations ' : 'favorite_destinations'

        const isInList = await prisma[updatedField].findUnique({
            where: {
                user_id_destination_id: {
                    user_id: userId,
                    destination_id: parseInt(destinationId)
                }
            }
        })

        if (!isInList) {
            return res.status(404).send(`No such destination in ${type}`)
        }

        const newUserDestination = await prisma[updatedField].delete(
            {
                where: {
                    user_id_destination_id: {
                        user_id: userId,
                        destination_id: parseInt(destinationId)
                    }
                }
            }
        )

        if (!newUserDestination) {
            return res.status(500).send(`Destination could not be removed from ${type}`)
        }

        return res.status(200).json({
            message: `Destination removed from list ${type}`
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

        const relationTable = type === 'favorite' ? 'favorite_destinations' : 'visited_destinations'

        const isInList = await prisma[relationTable].findUnique({
            where: {
                //user_id_destination_id is a virtual field name created by Prisma for the composite ID [user_id, destination_id].
                user_id_destination_id: {
                    user_id: userId,
                    destination_id: parseInt(destinationId)
                },
            }

        })
        if (isInList) {
            return res.status(409).send(`Destination is already in your ${type} list`)
        }

        const newUserDestination = await prisma[relationTable].create({
            data: {
                user_id: userId,
                destination_id: parseInt(destinationId)
            }
        })

        if (!newUserDestination) {
            return res.status(500).send(`Could not add destination to ${type} list`)
        }

        return res.status(200).json({
            message: `Destination added to List ${type}`
        })
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`Error ${error} occured while removing adding to favorites`)
    }
}

const usersDestinations = async (req, res) => {
    try {
        const userId = req.user?.id
        const validTypes = ['visited', 'favorite']
        const requestType = req.params.type
        if (!validTypes.includes(requestType)) {
            return res.status(400).send(`Allowed types are ${validTypes}`)
        }

        const relationTable = requestType === 'favorite' ? 'favorite_destinations' : 'visited_destinations'

        const usersList = await prisma[relationTable].findMany({
            where: {
                user_id: userId
            },
            // gets the full related destination info via foreign key - here destination_id
            include: {
                destinations: true
            }
        })
        // console.log(usersList) - returns an array 
        return res.status(200).json({
            userDestinations: usersList.map(entry => entry.destinations)
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).send(`An error: ${error} occurred while fetching the user's list.`);
    }
}

const changePasswordJWT = [body('newPassword').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long').matches(/\d/).withMessage('Password must contain at least one number'),
async (req, res) => {
    try {
        if (validationErrors(req, res)) return;

        const userId = req.user?.id
        const existingUser = await prisma.users.findUnique({ where: { id: userId } })

        const passwordCheck = validatePassword(req.body.password, existingUser.password)

        if (!passwordCheck) {
            return res.status(403).send('Please type your current password to change it to a new password')
        }

        const newPassword = hashPassword(req.body.newPassword)
        const updatedPassword = await prisma.users.update({
            where: { id: userId },
            data: {
                password: newPassword
            }
        })
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
    changePasswordJWT,
    usersDestinations
}