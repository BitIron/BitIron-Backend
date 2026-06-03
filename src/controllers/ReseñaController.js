const Reseña= require('../models/ReseñaModel');
const CustomError = require('../utils/CustomError');
const catchAsync = require('../utils/catchAsync');

const getAll = catchAsync(async (req, res, next) => {
  const { Reseña, idProducto, page = 1, limit = 10 } = req.query;

  // Convertir a números y asegurar que sean positivos
  const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

  const offset = (pageNum - 1) * limitNum;

  const filtros = { Reseña, idProducto };
  const paginacion = { limit: limitNum, offset };

  const result = await Reseña.getAll(filtros, paginacion);

  const totalPages = Math.ceil(result.total / limitNum);

  res.json({
    success: true,
    data: result.rows,
    meta: {
      totalItems: result.total,
      totalPages: totalPages,
      currentPage: pageNum,
      itemsPerPage: limitNum
    }
  });
});


const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const rows = await Reseña.getById(id);

  if (rows.length === 0) {
    return next(new CustomError('Reseña no encontrada', 404));
  }

  res.json(rows[0]);
});

const create = catchAsync(async (req, res, next) => {
  const { puntuacion, comentario } = req.body;

  if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
    return next(new CustomError('La puntuación debe ser un número del 1 al 5', 400));
  }
  if (!comentario) {
    return next(new CustomError('El comentario es obligatorio', 400));
  }

  
  console.warn(`[NUEVA RESEÑA RECIBIDA] Puntuación: ${puntuacion} | Fecha: ${new Date().toISOString()}`);

  const result = await Reseña.create(req.body);

  res.status(201).json({
    message: 'Reseña creada exitosamente',
    IdReseña: result.insertId
  });
});

const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await Reseña.update(id, req.body);

  if (result.affectedRows === 0) {
    return next(new CustomError('Reseña no encontrada para actualizar', 404));
  }

  res.json({ message: 'Reseña actualizada exitosamente' });
});

const deleteReseña = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await Reseña.delete(id);

  if (result.affectedRows === 0) {
    return next(new CustomError('Reseña no encontrada para eliminar', 404));
  }

  res.json({ message: 'Reseña eliminada exitosamente' });
});



module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteReseña: deleteReseña
};