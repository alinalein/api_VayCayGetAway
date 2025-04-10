const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/auth');
const { signUp, addDestination, deleteDestination, updateProfile, deleteProfie, getAllUsers, } = require('../controllers/userController')

router.post('/signup', signUp)

router.get('/users', getAllUsers)

router.delete('/deleteProfie', jwt, deleteProfie)

router.put('/updateProfile', jwt, updateProfile)

router.delete('/deleteDestination/:type/:id', jwt, deleteDestination)

router.put('/addDestination/:type/:id', jwt, addDestination)

module.exports = router; 