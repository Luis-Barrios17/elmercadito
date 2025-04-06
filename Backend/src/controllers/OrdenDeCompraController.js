const Order = require('../models/OrdenDeCompra');
const producto = require('../models/producto'); // Importar el modelo de Producto

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error al crear la orden
 *       404:
 *         description: Producto no encontrado o stock insuficiente
 */
exports.createOrder = async (req, res) => {
  try {
    const { Usuario, card, Direccion, items, total } = req.body;

    // Crear la orden
    const newOrder = new Order({
      Usuario,
      card,
      Direccion,
      items,
      total,
    });
    await newOrder.save();

    // Reducir el stock de cada producto
    for (const item of items) {
      const productoEncontrado = await producto.findById(item.Producto); // Buscar el producto por ID
      if (!productoEncontrado) {
        return res.status(404).json({ message: `Producto con ID ${item.Producto} no encontrado` });
      }

      // Verificar si hay suficiente stock
      if (productoEncontrado.stockProducto < item.Cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para el producto: ${productoEncontrado.nombre}` });
      }

      // Reducir el stock
      productoEncontrado.stockProducto -= item.Cantidad;
      await productoEncontrado.save();
    }

    res.status(201).json({ message: "Orden creada y stock Actualizado correctamente", order: newOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(400).json({ message: "Error al crear la orden", error });
  }
};
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description:  Error interno del servidor
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('Usuario').populate('Direccion').populate('items.Producto');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description:  Error interno del servidor
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('Usuario').populate('Direccion').populate('items.Producto');
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Actualizar una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description:  Error interno del servidor
 */
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('Usuario').populate('Direccion').populate('items.Producto');
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Eliminar una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden a eliminar
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description:  Error interno del servidor
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).send({ message: 'Orden no encontrada' });
    res.status(200).send({ message: 'Orden eliminada' });
  } catch (error) {
    res.status(500).send(error);
  }
};
