const CarritoCompra = require('../models/CarritoCompra');

/**
 * @swagger
 * /carritos:
 *   get:
 *     summary: Obtener todos los carritos de compra
 *     tags: [Carritos]
 *     responses:
 *       200:
 *         description: Lista de carritos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarritoCompra'
 *       500:
 *         description: Error interno del servidor
 */
exports.getCarritos = async (req, res) => {
  try {
    const carritos = await CarritoCompra.find().populate('user').populate('listaProductos.producto');
    res.status(200).send(carritos);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /carritos/{id}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarritoCompra'
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.getCarritoById = async (req, res) => {
  try {
    console.log('ID del carrito recibido:', req.params.id);
    const carrito = await CarritoCompra.findById(req.params.id).populate('user').populate('listaProductos.producto');
    console.log('Carrito encontrado:', carrito);
    if (carrito === null) {
      res.status(404).send({ message: 'Carrito no encontrado' });
    } else {
      res.status(200).send(carrito);
    }
  } catch (error) {
    console.error('Error al buscar el carrito:', error);
    res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /carritos:
 *   post:
 *     summary: Crear un nuevo carrito de compra
 *     tags: [Carritos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarritoCompra'
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarritoCompra'
 *       400:
 *         description: Error al crear el carrito
 */
exports.createCarrito = async (req, res) => {
  try {
    const carrito = new CarritoCompra(req.body);
    await carrito.save();
    res.status(201).send(carrito);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/**
 * @swagger
 * /carritos/{id}:
 *   put:
 *     summary: Actualizar un carrito por ID
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarritoCompra'
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarritoCompra'
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.updateCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const { listaProductos } = req.body;

    if (!listaProductos || !Array.isArray(listaProductos)) {
      return res.status(400).send({ message: 'Lista de productos no válida' });
    }

    const carrito = await CarritoCompra.findById(id);
    if (!carrito) {
      return res.status(404).send({ message: 'Carrito no Encontrado' });
    }

    carrito.listaProductos = listaProductos;

    await carrito.save();
    res.status(200).send(carrito);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * @swagger
 * /carritos/{id}:
 *   delete:
 *     summary: Eliminar un carrito por ID
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito a eliminar
 *     responses:
 *       200:
 *         description: Carrito eliminado exitosamente
 *       404:
 *         description: Carrito no encontrado
 *       400:
 *         description: Error interno del servidor
 */
exports.deleteCarrito = async (req, res) => {
  try {
    const carrito = await CarritoCompra.findByIdAndDelete(req.params.id);
    if (!carrito) {
      res.status(404).send({ message: 'Carrito no encontrado' });
    } else {
      res.status(200).send({ message: 'Carrito eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
