const Card = require('../models/cardModel');

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Obtener todas las tarjetas
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Lista de tarjetas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       500:
 *         description: Error interna del servidor
 */
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Obtener una tarjeta por ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarjeta
 *     responses:
 *       200:
 *         description: Tarjeta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Tarjeta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.getCardById = async (req, res) => {
  try {
    console.log('ID de la tarjeta recibido:', req.params.id);
    const card = await Card.findById(req.params.id);
    console.log('Tarjeta encontrada:', card);
    if (!card) {
      res.status(404).send({ message: 'Tarjeta no encontrada' });
    } else {
      res.status(200).send(card);
    }
  } catch (error) {
    console.error('Error al buscar la tarjeta:', error);
    res.status(500).send({ message: error.message });
  }
};


/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Crear una nueva tarjeta
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Tarjeta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Error al crear la tarjeta (por ejemplo, tarjeta duplicada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El número de tarjeta ya existe."
 *       500:
 *         description: Error interno del servidor
 */
exports.createCard = async (req, res) => {
  const { numeroTarjeta, Propietario, FechaExpiracion, cvv, isDefault, user } = req.body;

  try {
    // Verificar si el número de tarjeta ya existe para el usuario
    const existingCard = await Card.findOne({ numeroTarjeta, user });
    if (existingCard) {
      return res.status(400).json({ message: "El número de tarjeta ya existe." });
    }

    // Crear una nueva tarjeta
    const newCard = new Card({
      numeroTarjeta,
      Propietario,
      FechaExpiracion,
      cvv,
      isDefault,
      user,
    });

    await newCard.save();
    res.status(201).json({ message: "Tarjeta creada exitosamente.", card: newCard });
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    res.status(500).json({ error: "Error al crear la tarjeta." });
  }
};

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Actualizar una tarjeta por ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarjeta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Tarjeta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Tarjeta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.updateCard = async (req, res) => {
  try {
    // excluir campo 'usuario' de las actualizaciones
    const { user, ...updateData } = req.body;

    const card = await Card.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!card) {
      res.status(404).send({ message: 'Tarjeta no encontrada' });
    } else {
      res.status(200).send(card);
    }
  } catch (error) {
    res.status(500).send({ message: 'Error al actualizar la tarjeta' });
  }
};

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Eliminar una tarjeta por ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarjeta a eliminar
 *     responses:
 *       200:
 *         description: Tarjeta eliminada exitosamente
 *       404:
 *         description: Tarjeta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      res.status(404).send({ message: 'Tarjeta no encontrada' });
    } else {
      res.status(200).send({ message: 'Tarjeta eliminada exitosamente' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


