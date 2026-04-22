const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Definir las rutas para el CRUD de Categoría
router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.post('/', categoriaController.create);
router.put('/:id', categoriaController.update);
router.delete('/:id', categoriaController.delete);

module.exports = router;
