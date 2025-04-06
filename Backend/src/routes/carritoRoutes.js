const express = require('express');
const { body, param, query } = require('express-validator');
const carritoController = require('../controllers/carritoCompraController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/Validation');
const carritorouter = express.Router();

carritorouter.get('/carritos', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  ], validate, authMiddleware, carritoController.getCarritos);

carritorouter.get('/carritos/:id', [
    param('id').isMongoId().withMessage('ID de carrito no válido'),
  ], validate, authMiddleware, carritoController.getCarritoById);

carritorouter.post('/carritos', [
    body('user').isMongoId().withMessage('ID de usuario no válido'),
    body('listaProductos.*.producto').isMongoId().withMessage('ID de producto no válido'),
    body('listaProductos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad mínima es 1'),
  ], validate, authMiddleware, carritoController.createCarrito);

carritorouter.put('/carritos/:id', [
    param('id').isMongoId().withMessage('ID de carrito no válido'),
    body('user').optional().isMongoId().withMessage('ID de usuario no válido'),
    body('listaProductos.*.producto').optional().isMongoId().withMessage('ID de producto no válido'),
    body('listaProductos.*.cantidad').optional().isInt({ min: 1 }).withMessage('La cantidad mínima es 1'),
  ], validate, authMiddleware, carritoController.updateCarrito);

carritorouter.delete('/carritos/:id', [
    param('id').isMongoId().withMessage('ID de carrito no válido'),
  ], validate, authMiddleware, carritoController.deleteCarrito);

module.exports = carritorouter;