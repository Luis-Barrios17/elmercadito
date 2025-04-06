/**
 * @swagger
 * components:
 *   schemas:
 *     CarritoCompra:
 *       type: object
 *       required:
 *         - user
 *         - listaProductos
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario
 *         listaProductos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               producto:
 *                 type: string
 *                 description: ID del producto
 *               cantidad:
 *                 type: number
 *                 description: Cantidad del producto
 *                 default: 1
 */

/**
 * Modelo de Mongoose para el carrito de compra
 */
const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    listaProductos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});

const CarritoCompra = mongoose.model('CarritoCompra', carritoSchema);

module.exports = CarritoCompra;
