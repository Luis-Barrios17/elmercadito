/**
 * @swagger
 * components:
 *   schemas:
 *     Direction:
 *       type: object
 *       required:
 *         - usuario
 *         - calle
 *         - ciudad
 *         - estado
 *         - colonia
 *         - codigopostal
 *         - Numext
 *         - Numint
 *         - isDefault
 *       properties:
 *         usuario:
 *           type: string
 *           description: ID del usuario
 *         calle:
 *           type: string
 *           description: Calle de la dirección
 *         ciudad:
 *           type: string
 *           description: Ciudad de la dirección
 *         estado:
 *           type: string
 *           description: Estado de la dirección
 *         colonia:
 *          type: string
 *          description: Colonia de la dirección
 *         codigopostal:
 *           type: string
 *           description: Código postal de la dirección
 *         Numext:
 *           type: string
 *           description: Número exterior de la dirección
 *         Numint:
 *           type: string
 *           description: Número interior de la dirección
 *         isDefault:
 *           type: boolean
 *           description: Indica si la dirección es predeterminada
 */

/**
 * Modelo de Mongoose para la dirección
 */
const mongoose = require('mongoose');

const directionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  calle: { type: String, required: true },
  ciudad: { type: String, required: true },
  estado: { type: String, required: true },
  colonia: { type: String, required: true },
  codigopostal: { type: String, required: true },
  Numext: { type: String, required: true },
  Numint: { type: String, required: false },
  isDefault: { type: Boolean, default: false } // Indica si es la dirección predeterminada
}, {
  timestamps: true
});

module.exports = mongoose.models.Direction || mongoose.model('Direction', directionSchema);

