
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - Usuario
 *         - card
 *         - Direccion
 *         - items
 *         - total
 *         - Estado
 *         - CreacionOrden
 *       properties:
 *         Usuario:
 *           type: string
 *           description: ID del usuario que hizo la orden
 *         card:
 *           type: string
 *           description: ID de la tarjeta usada para la orden
 *         Direccion:
 *           type: string
 *           description: ID de la dirección de entrega
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               Producto:
 *                 type: string
 *                 description: ID del producto
 *               Cantidad:
 *                 type: integer
 *                 description: Cantidad del producto
 *                 minimum: 1
 *               Precio:
 *                 type: number
 *                 description: Precio del producto
 *                 minimum: 0
 *         total:
 *           type: number
 *           description: Monto total de la orden
 *           minimum: 0
 *         Estado:
 *           type: string
 *           enum: [Pendiente, Completado, Cancelado]
 *           description: Estado de la orden
 *           default: Pendiente
 *         CreacionOrden:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la orden
 *       example:
 *         Usuario: String
 *         card: String
 *         Direccion: String
 *         items:
 *           - Producto: String
 *             Cantidad: 0
 *             Precio: 0
 *         total: 0
 *         Estado: Pendiente
 *         CreacionOrden: 2023-04-06T11:54:03.000Z
 */
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    Usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    card: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Card', 
        required: true 

    },
    Direccion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Direction',
        required: true
    },
    items: [{
        Producto: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Producto', 
            required: true 
        },
        Cantidad: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        Precio: { 
            type: Number, 
            required: true, 
            min: 0 
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    Estado: {
        type: String,
        enum: ['Pendiente', 'Completado', 'Cancelado'],
        default: 'Pendiente'
    },
    CreacionOrden: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
