const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { validateCarrito } = require('../validators/carritoValidator');

router.get('/:idCliente', carritoController.getCarrito);
router.post('/', validateCarrito, carritoController.agregarAlCarrito);
router.put('/:id', validateCarrito, carritoController.actualizarCantidad);
router.delete('/:id', carritoController.eliminarDelCarrito);
router.delete('/clear/:idCliente', carritoController.vaciarCarrito);

module.exports = router;