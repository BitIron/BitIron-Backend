const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);
router.post('/', verificarToken, esAdmin, productoController.create);
router.post('/descuento', verificarToken, esAdmin, productoController.aplicarDescuentoMarca);
router.put('/:id', verificarToken, esAdmin, productoController.update);
router.delete('/:id', verificarToken, esAdmin, productoController.delete);

module.exports = router;
