const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { validateCategoria } = require('../validators/categoriaValidator');

// Definir las rutas para el CRUD de Categoría
router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.post('/', validateCategoria, categoriaController.create);
router.put('/:id', validateCategoria, categoriaController.update);
router.delete('/:id', categoriaController.delete);

module.exports = router;
