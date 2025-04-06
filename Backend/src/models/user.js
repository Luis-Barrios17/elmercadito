const mongoose = require('mongoose');
const { Schema } = mongoose;
const Roles = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest"
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario (encriptada)
 *         role:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum: ['admin', 'user', 'guest']
 *                 description: Rol del usuario
 *               permisos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Permisos asociados al rol del usuario
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 */
const userSchema = new mongoose.Schema({
  /*userId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true,
  },*/
    name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [{
    name: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER, // Default role
      required: true
    },
    permisos: [{
      type: String,
      required: true,
    }],
  }],  
});

const User = mongoose.model('User', userSchema);
module.exports = User;