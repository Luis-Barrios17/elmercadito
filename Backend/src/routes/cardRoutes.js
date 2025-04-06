const express = require('express');
const { body, param, query } = require('express-validator');
const cardController = require('../controllers/cardController');
const validate = require('../middleware/Validation');
const authMiddleware = require('../middleware/authMiddleware'); 
const cardrouter = express.Router();

cardrouter.get('/cards', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  ], validate, authMiddleware, cardController.getCards);

cardrouter.get('/cards/:id', [
    param('id').isMongoId().withMessage('Invalid card ID'),
  ], validate, authMiddleware, cardController.getCardById);

  cardrouter.post('/cards', [
    body('numeroTarjeta')
      .notEmpty().withMessage('Card number is required')
      .isLength({ min: 16, max: 16 }).withMessage('Card number must be 16 digits')
      .isNumeric().withMessage('Card number must contain only numbers'),
    body('Propietario')
      .notEmpty().withMessage('Propietario is required')
      .isString().withMessage('Propietario must be a string'),
    body('FechaExpiracion')
      .notEmpty().withMessage('Fecha de expiracion is required')
      .matches(/^\d{2}\/\d{4}$/).withMessage('Fecha de expiracion must be in MM/YYYY format'),
    body('cvv')
      .notEmpty().withMessage('cvv is required')
      .isLength({ min: 3, max: 3 }).withMessage('cvv must be 3 digits')
      .isNumeric().withMessage('cvv must contain only numbers'),
    body('isDefault')
      .optional()
      .isBoolean().withMessage('isDefault must be a boolean value'),
  ], validate, authMiddleware, cardController.createCard);
  cardrouter.put('/cards/:id', [
    param('id')
      .isMongoId().withMessage('Invalid card ID'),
    body('numeroTarjeta')
      .optional()
      .isLength({ min: 16, max: 16 }).withMessage('Card number must be 16 digits')
      .isNumeric().withMessage('Card number must contain only numbers'),
    body('Propietario')
      .optional()
      .isString().withMessage('Propietario must be a string'),
    body('FechaExpiracion')
      .optional()
      .matches(/^\d{2}\/\d{4}$/).withMessage('Fecha de expiracion must be in MM/YYYY format'),
    body('cvv')
      .optional()
      .isLength({ min: 3, max: 3 }).withMessage('cvv must be 3 digits')
      .isNumeric().withMessage('cvv must contain only numbers'),
    body('isDefault')
      .optional()
      .isBoolean().withMessage('isDefault must be a boolean value'),
  ], validate, authMiddleware, cardController.updateCard);
cardrouter.delete('/cards/:id', [
    param('id').isMongoId().withMessage('Invalid card ID'),
  ], validate, authMiddleware, cardController.deleteCard);


  module.exports = cardrouter;