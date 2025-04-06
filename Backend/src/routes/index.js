const express = require('express');

const router = express.Router();
const authRoute = require('./authRoute');
const userRoutes = require('./userRoutes');
const cardRoutes = require('./cardRoutes');
const productoRoutes = require('./productoRoutes');
const OrdenDeCompraRoutes = require('./OrdenDeCompraRoutes');
const carritoRoutes = require('./carritoRoutes');
const directionRoutes = require('./directionRoutes');

//Usar rutas de las entidades
router.use(authRoute);
router.use(userRoutes);
router.use(cardRoutes);
router.use(productoRoutes);
router.use(OrdenDeCompraRoutes);
router.use(carritoRoutes);
router.use(directionRoutes);

module.exports = router;
