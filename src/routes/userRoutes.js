const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/auth');
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

router.delete('/deleteDestination/:id', jwt, (req, res) => {

    try {

    }
    catch (error) {

    }
})

router.put('/addDestination', jwt, (req, res) => {

    try {

    }
    catch (error) {

    }
})

// router.delete('/deleteProfie', jwt, (req, res) => {

//     try {

//     }
//     catch (error) {

//     }
// })

module.exports = router; 