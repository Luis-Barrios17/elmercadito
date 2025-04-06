const express = require('express');
const { check, validationResult, query } = require('express-validator');
const directionController = require('../controllers/directionController');
const directionrouter = express.Router();
const validate = require('../middleware/Validation');
const authMiddleware = require('../middleware/authMiddleware');

const validateDirection = [
  check('usuario').isMongoId().withMessage('Usuario debe ser un ID válido de MongoDB'),
  check('calle').notEmpty().withMessage('Calle es requerida'),
  check('ciudad').notEmpty().withMessage('Ciudad es requerida'),
  check('estado').notEmpty().withMessage('Estado es requerido'),
  check('colonia').notEmpty().withMessage('Colonia es requerida'),
  check('codigopostal').notEmpty().withMessage('Código postal es requerido'),
  check('Numext').notEmpty().withMessage('Número exterior es requerido'),
  check('Numint').notEmpty().withMessage('Número interior es requerido'),
  check('isDefault').optional().isBoolean().withMessage('isDefault debe ser un valor booleano') // Validación para isDefault
];

const validateId = [
  check('id').isMongoId().withMessage('ID debe ser un ID válido de MongoDB')
];

directionrouter.get('/directions', [
    query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un entero positivo'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  ], validate, authMiddleware, directionController.getDirections);

directionrouter.get('/directions/:id', validateId, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, directionController.getDirectionById);

directionrouter.post('/directions', validateDirection, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, directionController.createDirection);

directionrouter.put('/directions/:id', [...validateId, ...validateDirection], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, directionController.updateDirection);

directionrouter.delete('/directions/:id', validateId, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, directionController.deleteDirection);


directionrouter.get('/directions/user', authMiddleware, directionController.getDirectionsByUserId);

module.exports = directionrouter;