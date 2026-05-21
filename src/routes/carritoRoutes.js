const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { validateCarrito, validateUpdateCantidad } = require('../validators/carritoValidator');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, carritoController.getCarrito);
router.post('/', verificarToken, validateCarrito, carritoController.agregarAlCarrito);
router.put('/:id', verificarToken, validateUpdateCantidad, carritoController.actualizarCantidad);
router.delete('/clear', verificarToken, carritoController.vaciarCarrito);
router.delete('/:id', verificarToken, carritoController.eliminarDelCarrito);

module.exports = router;