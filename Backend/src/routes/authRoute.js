const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/Validation');
const { body} = require('express-validator');
const { registerLimiter } = require('../middleware/rateLimiter');



router.post('/login', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, authController.login);

router.post('/register', registerLimiter ,[
    body('name').notEmpty().withMessage('Name for the display is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], validate, authController.register);

router.post('/refresh-token', [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], authController.refreshToken);



module.exports = router;