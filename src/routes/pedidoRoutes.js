const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { validateCheckout, validateEstadoPedido } = require('../validators/pedidoValidator');

const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// Ruta para procesar el pedido desde el carrito actual del cliente
router.post('/checkout', validateCheckout, pedidoController.realizarCheckout);

// Ruta para obtener el historial de pedidos de un cliente
router.get('/cliente/:idCliente', pedidoController.obtenerHistorial);

// Ruta para que el admin gestione el estado de un pedido
router.put('/:idPedido/estado', verificarToken, esAdmin, validateEstadoPedido, pedidoController.actualizarEstado);

module.exports = router;
