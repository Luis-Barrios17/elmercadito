/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - user
 *         - NumeroTarjeta
 *         - Propietario
 *         - FechaExpiracion
 *         - cvv
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario
 *         numeroTarjeta:
 *           type: string
 *           description: Número de la tarjeta
 *         Propietario:
 *           type: string
 *           description: Nombre del propietario de la tarjeta
 *         FechaExpiracion:
 *           type: string
 *           description: Fecha de expiración de la tarjeta (MM/AA)
 *         cvv:
 *           type: string
 *           description: Código CVV de la tarjeta
 *         isDefault:
 *           type: boolean
 *           description: Indica si es la tarjeta predeterminada
 *           default: false
 */

/**
 * Modelo de Mongoose para la tarjeta de crédito
 */
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numeroTarjeta: { type: String, required: true },
  Propietario: { type: String, required: true },
  FechaExpiracion: { type: String, required: true },
  cvv: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model('Card', cardSchema);

