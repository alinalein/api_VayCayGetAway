const express = require('express');
const router = express.Router();
const { loginUserJwT, loginGoogleStart, loginGoogleCallback } = require('../controllers/authController')

router.post('/login', loginUserJwT)
router.get('/auth/google', loginGoogleStart)
router.get('/auth/google/callback', loginGoogleCallback)

module.exports = router;