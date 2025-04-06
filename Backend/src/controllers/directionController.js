
const Direction = require('../models/direction');

/**
 * @swagger
 * /directions:
 *   get:
 *     summary: Obtener todas las direcciones
 *     tags: [Directions]
 *     responses:
 *       200:
 *         description: Lista de direcciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Direction'
 *       500:
 *         description: Error interno del servidor
 */
exports.getDirections = async (req, res) => {
  try {
    const directions = await Direction.find();
    res.status(200).send(directions);
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener direcciones' });
  }
};

/**
 * @swagger
 * /directions/{id}:
 *   get:
 *     summary: Obtener una dirección por ID
 *     tags: [Directions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la dirección
 *     responses:
 *       200:
 *         description: Dirección obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direction'
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.getDirectionById = async (req, res) => {
  try {
    console.log('ID de la dirección recibido:', req.params.id);
    const direction = await Direction.findById(req.params.id);
    console.log('Dirección encontrada:', direction);
    if (!direction) {
      res.status(404).send({ message: 'Dirección no encontrada' });
    } else {
      res.status(200).send(direction);
    }
  } catch (error) {
    console.error('Error al buscar la dirección:', error);
    res.status(500).send({ message: 'Error al buscar la dirección' });
  }
};

/**
 * @swagger
 * /directions:
 *   post:
 *     summary: Crear una nueva dirección
 *     tags: [Directions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direction'
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direction'
 *       400:
 *         description: Error al crear la dirección
 */
exports.createDirection = async (req, res) => {
  try {
    const { usuario, calle, ciudad, estado, colonia, codigopostal, Numext, Numint, isDefault } = req.body;
    const newDirection = new Direction({ usuario, calle, ciudad, estado, colonia, codigopostal, Numext, Numint, isDefault });
    await newDirection.save();
    res.status(201).send(newDirection);
  } catch (error) {
    res.status(400).send({ message: 'Error al crear la Dirección' });
  }
};

/**
 * @swagger
 * /directions/{id}:
 *   put:
 *     summary: Actualizar una dirección por ID
 *     tags: [Directions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la dirección a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calle:
 *                 type: string
 *                 description: Calle de la dirección
 *               ciudad:
 *                 type: string
 *                 description: Ciudad de la dirección
 *               estado:
 *                 type: string
 *                 description: Estado de la dirección
 *               codigopostal:
 *                 type: string
 *                 description: Código postal de la dirección
 *               Numext:
 *                 type: string
 *                 description: Número exterior de la dirección
 *               Numint:
 *                 type: string
 *                 description: Número interior de la dirección
 *             required:
 *               - calle
 *               - ciudad
 *               - estado
 *               - codigopostal
 *               - Numext
 *               - Numint
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direction'
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor 
 */
exports.updateDirection = async (req, res) => {
  try {
    // Excluir el campo `usuario` de las actualizaciones
    const { usuario, ...updateData } = req.body;

    const direction = await Direction.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!direction) {
      res.status(404).send({ message: 'Dirección no encontrada' });
    } else {
      res.status(200).send(direction);
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar la dirección' });
  }
};

/**
 * @swagger
 * /directions/{id}:
 *   delete:
 *     summary: Eliminar una dirección por ID
 *     tags: [Directions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la dirección a eliminar
 *     responses:
 *       200:
 *         description: Dirección eliminada exitosamente
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.deleteDirection = async (req, res) => {
  try {
    const direction = await Direction.findByIdAndDelete(req.params.id);
    if (!direction) {
      res.status(404).send({ message: 'Dirección no encontrada' });
    } else {
      res.status(200).send({ message: 'Dirección eliminada exitosamente' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al eliminar la dirección' });
  }
};
/**
 * @swagger
 * /directions/user:
 *   get:
 *     summary: Obtener todas las direcciones del usuario autenticado
 *     tags: [Directions]
 *     description: Este endpoint devuelve todas las direcciones asociadas al usuario autenticado.
 *     security:
 *       - bearerAuth: [] # Indica que este endpoint requiere autenticación con JWT
 *     responses:
 *       200:
 *         description: Lista de direcciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/direction'
 *       401:
 *         description: Usuario no autenticado o token inválido
 *       404:
 *         description: No se encontraron direcciones para este usuario
 *       500:
 *         description: Error interno del servidor
 */
exports.getDirectionsByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Este es el ID del usuario autenticado
    console.log("ID del usuario autenticado:", userId);

    const directions = await Direction.find({ user: userId });
    if (!directions || directions.length === 0) {
      return res.status(404).json({ message: 'No se encontraron direcciones para este usuario.' });
    }

    res.status(200).json(directions);
  } catch (error) {
    console.error('Error al obtener las direcciones:', error.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};