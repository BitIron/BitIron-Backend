const express = require('express');
const router = express.Router();
const asesoriaController = require('../controllers/asesoriaController');
// Podríamos añadir verificarToken o esAdmin aquí si quisiéramos protegerlas
// const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

const { asesoriaCreateValidator, asesoriaUpdateValidator } = require('../validators/asesoriaValidator');

router.get('/', asesoriaController.getAll);
router.get('/:id', asesoriaController.getById);
router.post('/', asesoriaCreateValidator, asesoriaController.create);
router.put('/:id', asesoriaUpdateValidator, asesoriaController.update);
router.delete('/:id', asesoriaController.remove);

module.exports = router;
