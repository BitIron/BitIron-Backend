const express = require('express');
const router = express.Router();
const asesoriaController = require('../controllers/asesoriaController');
const { verificarToken } = require('../middlewares/authMiddleware');

const { asesoriaCreateValidator, asesoriaUpdateValidator } = require('../validators/asesoriaValidator');

router.get('/', verificarToken, asesoriaController.getAll);
router.get('/:id', verificarToken, asesoriaController.getById);
router.post('/', verificarToken, asesoriaCreateValidator, asesoriaController.create);
router.put('/:id', verificarToken, asesoriaUpdateValidator, asesoriaController.update);
router.delete('/:id', verificarToken, asesoriaController.remove);

module.exports = router;
