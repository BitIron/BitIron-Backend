const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

const { productoCreateValidator, productoUpdateValidator, descuentoValidator } = require('../validators/productoValidator');

router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);
router.post('/', verificarToken, esAdmin, productoCreateValidator, productoController.create);
router.post('/descuento', verificarToken, esAdmin, descuentoValidator, productoController.aplicarDescuentoMarca);
router.put('/:id', verificarToken, esAdmin, productoUpdateValidator, productoController.update);
router.delete('/:id', verificarToken, esAdmin, productoController.delete);

module.exports = router;
