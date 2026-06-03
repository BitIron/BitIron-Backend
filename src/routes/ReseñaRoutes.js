 const express = require('express')
const router = express.Router();
const ReseñaController = require('../controllers/ReseñaController');
const { verificarToken } = require('../middlewares/authMiddleware');
router.get('/', ReseñaController.getAll);
router.get('/:id', ReseñaController.getById);
router.post('/', verificarToken,  ReseñaController.create);
router.put('/:id', verificarToken, ReseñaController.update);
router.delete('/:id', verificarToken, ReseñaController.deleteReseña);

module.exports = router;