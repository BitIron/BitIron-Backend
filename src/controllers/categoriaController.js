const Categoria = require('../models/categoriaModel');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

// Obtener todas las categorías
const getAll = catchAsync(async (req, res, next) => {
    const rows = await Categoria.getAll();
    res.json(rows);
});

// Obtener una categoría por ID
const getById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const rows = await Categoria.getById(id);

    if (rows.length === 0) {
        return next(new CustomError('Categoría no encontrada', 404));
    }

    res.json(rows[0]);
});

// Crear una nueva categoría
const create = catchAsync(async (req, res, next) => {
    const { Nombre } = req.body;

    // Validación básica
    if (!Nombre) {
        return next(new CustomError('El campo Nombre es obligatorio', 400));
    }

    const result = await Categoria.create(req.body);

    res.status(201).json({
        message: 'Categoría creada exitosamente',
        id: result.insertId
    });
});

// Actualizar una categoría existente
const update = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { Nombre } = req.body;

    // Validación básica
    if (!Nombre) {
        return next(new CustomError('El campo Nombre es obligatorio', 400));
    }

    const result = await Categoria.update(id, req.body);

    if (result.affectedRows === 0) {
        return next(new CustomError('Categoría no encontrada', 404));
    }

    res.json({ message: 'Categoría actualizada exitosamente' });
});

// Eliminar una categoría (con Borrado Controlado - Lógica de Negocio)
const remove = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // 1. Lógica de negocio: Verificar si la categoría tiene productos asociados
    const count = await Categoria.countProductos(id);

    if (count > 0) {
        return next(new CustomError('No se puede eliminar la categoría porque tiene productos asociados. Reasigne o elimine los productos primero.', 400));
    }

    // 2. Si no hay productos, procedemos a eliminar
    const result = await Categoria.delete(id);

    if (result.affectedRows === 0) {
        return next(new CustomError('Categoría no encontrada', 404));
    }

    res.json({ message: 'Categoría eliminada exitosamente' });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove
};