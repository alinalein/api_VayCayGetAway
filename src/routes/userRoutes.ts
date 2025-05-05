import express from 'express'
const router = express.Router();
import jwtAuth from '../middlewares/auth'
import userController from '../controllers/userController'
const { usersDestinations, signUp, updateProfile, deleteProfile, getAllUsers,
    changePasswordJWT, addDestination, deleteDestination } = userController

router.post('/signup', signUp)

router.get('/users', getAllUsers)

router.delete('/deleteProfie', jwtAuth, deleteProfile)

router.put('/updateProfile', jwtAuth, updateProfile)

router.delete('/deleteDestination/:type/:destinationId', jwtAuth, deleteDestination)

router.put('/addDestination/:type/:destinationId', jwtAuth, addDestination)

router.get('/usersDestinations/:type', jwtAuth, usersDestinations)

router.put('/changePassword', jwtAuth, changePasswordJWT)

export default router; 