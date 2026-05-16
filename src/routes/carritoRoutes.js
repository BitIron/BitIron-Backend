const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { validateCarrito } = require('../validators/carritoValidator');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, carritoController.getCarrito);
router.post('/', verificarToken, validateCarrito, carritoController.agregarAlCarrito);
router.put('/:id', verificarToken, validateCarrito, carritoController.actualizarCantidad);
router.delete('/:id', verificarToken, carritoController.eliminarDelCarrito);
router.delete('/clear', verificarToken, carritoController.vaciarCarrito);

module.exports = router;