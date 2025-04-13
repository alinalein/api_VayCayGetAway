const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/auth');
const { usersDestinations, signUp, updateProfile, deleteProfie, getAllUsers, changePasswordJWT, addDestination, deleteDestination } = require('../controllers/userController')

router.post('/signup', signUp)

router.get('/users', getAllUsers)

router.delete('/deleteProfie', jwt, deleteProfie)

router.put('/updateProfile', jwt, updateProfile)

router.delete('/deleteDestination/:type/:destinationId', jwt, deleteDestination)

router.put('/addDestination/:type/:destinationId', jwt, addDestination)

router.get('/usersDestinations/:type', jwt, usersDestinations)

router.put('/changePassword', jwt, changePasswordJWT)
module.exports = router; 