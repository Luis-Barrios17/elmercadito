const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/Validation');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/users', [
    authMiddleware,
    body('name').notEmpty().withMessage('Nombre es requerido'),
    body('email').isEmail().withMessage('Email debe de ser requerido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
],  validate, userController.createUser);

router.get('/users', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page debe de ser un entero positivo'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit debe de ser un entero positivo'),
], validate, userController.getUsers);

router.put('/users/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('Usuario no encontrado'),
    body('name').optional().notEmpty().withMessage('Nombre es requerido'),
    body('email').optional().isEmail().withMessage('Email debe de ser requerido'),
    body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe de tener al menos 6 caracteres'),
], validate, userController.updateUser);

router.delete('/users/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('Usuario no encontrado')
], validate, userController.deleteUser);

router.get('/users/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('Usuario no encontrado')
], validate, userController.getUserById);



module.exports = router;