import express from 'express'
import authController from '../controllers/authController';

const { loginUserJwT, loginGoogleStart, loginGoogleCallback } = authController;
const router = express.Router()

router.post('/login', loginUserJwT)
router.get('/auth/google', loginGoogleStart)
router.get('/auth/google/callback', loginGoogleCallback)

export default router;