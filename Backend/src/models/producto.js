/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombreProducto
 *         - descripcionProducto
 *         - precioProducto
 *         - stockProducto
 *         - categoriaProducto
 *         - marcaProducto
 *       properties:
 *         nombreProducto:
 *           type: string
 *           description: Nombre del producto
 *         descripcionProducto:
 *           type: string
 *           description: Descripción del producto
 *         precioProducto:
 *           type: number
 *           description: Precio del producto
 *           minimum: 0
 *         stockProducto:
 *           type: number
 *           description: Cantidad de stock del producto
 *           minimum: 0
 *         categoriaProducto:
 *           type: string
 *           description: Categoría del producto
 *         imagenProducto:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las imágenes del producto
 *           default: []
 *         marcaProducto:
 *           type: string
 *           description: Marca del producto
 */

/**
 * Modelo de Mongoose para el producto
 */
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombreProducto: {
        type: String,
        required: true,
    },
    descripcionProducto: {
        type: String,
        required: true,
    },
    precioProducto: {
        type: Number,
        required: true,
        min: 0,
    },
    stockProducto: {
        type: Number,
        required: true,
        min: 0,
    },
    categoriaProducto: {
        type: String,
        required: true
    },
    imagenProducto: {
        type: [String],
        default: []
    },
    marcaProducto: {
        type: String,
        required: true
    },

});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
