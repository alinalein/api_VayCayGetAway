const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/auth');
const { Destination } = require('../models/destination');
const Users = require('../models/user').User

router.post('/signup', async (req, res) => {
    try {
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
})

router.get('/users', async (req, res) => {
    try {
        const allUsers = await Users.find()
        return res.status(200).json(allUsers)
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`could not get all users ${error}`)
    }
})

router.delete('/deleteProfie', jwt, async (req, res) => {
    try {
        const usernameFromToken = req.user?.username;
        const deletedUser = await Users.deleteOne({ username: usernameFromToken })
        return res.status(200).send(`Profile ${deletedUser} deleted successful`)
    }
    catch (error) {
        console.error(error)
        return res.status(400).send(`Profile couldnt be deleted, error ${error}`)
    }
})

router.put('/updateProfile', jwt, async (req, res) => {
    try {
        // try to access user - if user - null - will not crash because of ? 
        const usernameFromToken = req.user?.username;
        if (!usernameFromToken) {
            return res.status(401).send('You must be logged in for this operation')
        }

        const { username, email, birthday } = req.body;
        if (!username && !email && !birthday) {
            return res.status(400).send('fill out all fields to update the profile ')
        }

        const existingUser = await Users.findOne({ username })
        if (existingUser && existingUser.username !== usernameFromToken) {
            return res.status(401).send(`Username ${existingUser.username} already exists, please pick another one`)
        }
        const updatedUser = await Users.findOneAndUpdate(
            {
                username: usernameFromToken
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
})

router.delete('/deleteDestination/:type/:id', jwt, async (req, res) => {
    try {
        const usernameFromToken = req.user?.username;
        const { type, id } = req.params
        const validTypes = ['visited', 'favorite']

        if (!validTypes.includes(type)) {
            return res.status(400).send(`Invalid type. Valid typed are ${validTypes}`)
        }

        const updatedField = type === 'visited' ? 'visitedDestinations' : 'favoriteDestinations'

        const isInList = await Users.findOne({
            username: usernameFromToken,
            // mongoose interprets it as is id in array?
            [updatedField]: id
        })

        if (!isInList) {
            return res.status(404).send(`No such destination in ${type}`)
        }

        const updatedUser = await Users.findOneAndUpdate(
            { username: usernameFromToken },
            { $pull: { [updatedField]: id } },
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
})

router.put('/addDestination/:type/:id', jwt, async (req, res) => {
    try {
        const usernameFromToken = req.user?.username
        const { id, type } = req.params
        const validTypes = ['visited', 'favorite']

        if (!validTypes.includes(type)) {
            return res.status(400).send(`Invalid type. Allowed types are ${validTypes}`)
        }

        const toUpdateField = type === 'favorite' ? 'favoriteDestinations' : 'visitedDestinations'

        const isInList = await Users.findOne({
            username: usernameFromToken,
            // mongoose interprets as is id in array? - if would write just visitedDestinations, would not need to set [] around
            [toUpdateField]: id
        })
        if (isInList) {
            return res.status(409).send(`Destination is already in your ${type} list`)
        }
        const updatedUser = await Users.findOneAndUpdate(
            { username: usernameFromToken },
            { $addToSet: { [toUpdateField]: id } },
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
})

module.exports = router; 