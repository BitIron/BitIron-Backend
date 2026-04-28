const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Ruta para procesar el pedido desde el carrito actual del cliente
router.post('/checkout', pedidoController.realizarCheckout);

module.exports = router;
