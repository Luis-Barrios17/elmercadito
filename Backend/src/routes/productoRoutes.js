const express = require('express');
const { body, param, query } = require('express-validator'); // Importa `query` desde `express-validator`
const productoController = require('../controllers/productoController');
const validate = require('../middleware/Validation'); // Corrige la importación de `validate`
const authMiddleware = require('../middleware/authMiddleware');
const productorouter = express.Router();

productorouter.get('/productos', [

    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
], validate, productoController.getProductos);

productorouter.get('/productos/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('ID inválido'),
], validate, productoController.getProductoById);

productorouter.post('/productos', [
    authMiddleware,
    body('nombreProducto').isString().notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcionProducto').isString().notEmpty().withMessage('La descripción del producto es requerida'),
    body('precioProducto').isFloat({ min: 0 }).withMessage('El precio del producto debe ser un número positivo'),
    body('stockProducto').isInt({ min: 0 }).withMessage('El stock del producto debe ser un número entero positivo'),
    body('categoriaProducto').isString().notEmpty().withMessage('La categoría del producto es requerida'),
    body('imagenProducto').isArray().withMessage('Las imágenes del producto deben ser un arreglo de URLs'),
    body('marcaProducto').isString().notEmpty().withMessage('La marca del producto es requerida')
], validate, productoController.createProducto);

productorouter.put('/productos/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('ID inválido'),
    body('nombreProducto').isString().notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcionProducto').isString().notEmpty().withMessage('La descripción del producto es requerida'),
    body('precioProducto').isFloat({ min: 0 }).withMessage('El precio del producto debe ser un número positivo'),
    body('stockProducto').isInt({ min: 0 }).withMessage('El stock del producto debe ser un número entero positivo'),
    body('categoriaProducto').isString().notEmpty().withMessage('La categoría del producto es requerida'),
    body('imagenProducto').isArray().withMessage('Las imágenes del producto deben ser un arreglo de URLs'),
    body('marcaProducto').isString().notEmpty().withMessage('La marca del producto es requerida')
], validate, productoController.updateProducto);

productorouter.delete('/productos/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('ID inválido'),
], validate, productoController.deleteProducto);

module.exports = productorouter;