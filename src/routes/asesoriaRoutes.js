const express = require('express');
const router = express.Router();
const asesoriaController = require('../controllers/asesoriaController');
// Podríamos añadir verificarToken o esAdmin aquí si quisiéramos protegerlas
// const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', asesoriaController.getAll);
router.get('/:id', asesoriaController.getById);
router.post('/', asesoriaController.create);
router.put('/:id', asesoriaController.update);
router.delete('/:id', asesoriaController.remove);

module.exports = router;
