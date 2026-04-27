const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.get('/:idCliente', carritoController.getCarrito);
router.post('/', carritoController.agregarAlCarrito);
router.put('/:id', carritoController.actualizarCantidad);
router.delete('/:id', carritoController.eliminarDelCarrito);

module.exports = router;