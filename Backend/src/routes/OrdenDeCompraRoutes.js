const express = require('express');
const { body, param, query } = require('express-validator');
const OrdenDeCompraController = require('../controllers/OrdenDeCompraController');
const validate = require('../middleware/Validation');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/orders/', [
body('Usuario').isMongoId().withMessage('ID de usuario no válido'),
body('card').isMongoId().withMessage('ID de tarjeta no válido'),
body('Direccion').isMongoId().withMessage('ID de dirección no válido'),
body('items').isArray().withMessage('Items deben ser un array')
    .bail().custom((items) => {
    if (items.length === 0) {
        throw new Error('Debe haber al menos un producto en los items');
    }
    return true;
    })
    .bail().custom((items) => {
    for (let item of items) {
        if (!item.Producto || !item.Cantidad || item.Cantidad <= 0 || !item.Precio || item.Precio < 0) {
        throw new Error('Cada producto debe tener un ID, cantidad y precio válidos');
        }
    }
    return true;
    }),
body('total').isFloat({ min: 0 }).withMessage('El total debe ser un número mayor o igual a 0'),
body('Estado').optional().isIn(['Pendiente', 'Completado', 'Cancelado']).withMessage('Estado no válido'),
], validate, authMiddleware, OrdenDeCompraController.createOrder);


router.get('/orders/', [
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
], validate, authMiddleware, OrdenDeCompraController.getOrders);


router.get('/orders/:id', [
param('id').isMongoId().withMessage('ID de orden no válido'),
], validate, authMiddleware, OrdenDeCompraController.getOrderById);


router.put('/orders/:id', [
param('id').isMongoId().withMessage('ID de orden no válido'),
body('Usuario').optional().isMongoId().withMessage('ID de usuario no válido'),
body('card').optional().isMongoId().withMessage('ID de tarjeta no válido'),
body('Direccion').optional().isMongoId().withMessage('ID de dirección no válido'),
body('items').optional().isArray().withMessage('Items deben ser un array')
    .bail().custom((items) => {
    if (items.length === 0) {
        throw new Error('Debe haber al menos un producto en los items');
    }
    return true;
    })
    .bail().custom((items) => {
    for (let item of items) {
        if (!item.Producto || !item.Cantidad || item.Cantidad <= 0 || !item.Precio || item.Precio < 0) {
        throw new Error('Cada producto debe tener un ID, cantidad y precio válidos');
        }
    }
    return true;
    }),
body('total').optional().isFloat({ min: 0 }).withMessage('El total debe ser un número mayor o igual a 0'),
body('Estado').optional().isIn(['Pendiente', 'Completado', 'Cancelado']).withMessage('Estado no válido'),
], validate, authMiddleware, OrdenDeCompraController.updateOrder);


router.delete('/orders/:id', [
param('id').isMongoId().withMessage('ID de orden no válido'),
], validate, authMiddleware, OrdenDeCompraController.deleteOrder);

module.exports = router;