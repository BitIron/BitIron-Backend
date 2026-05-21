const Producto = require('../models/productoModel');
const CustomError = require('../utils/CustomError');
const catchAsync = require('../utils/catchAsync');

const getAll = catchAsync(async (req, res, next) => {
  const { nombre, idCategoria, page = 1, limit = 10 } = req.query;

  // Convertir a números y asegurar que sean positivos
  const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

  // Calcular cuántos registros saltarse (offset)
  const offset = (pageNum - 1) * limitNum;

  const filtros = { nombre, idCategoria };
  const paginacion = { limit: limitNum, offset };

  const result = await Producto.getAll(filtros, paginacion);

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
  const rows = await Producto.getById(id);

  if (rows.length === 0) {
    return next(new CustomError('Producto no encontrado', 404));
  }

  res.json(rows[0]);
});

const create = catchAsync(async (req, res, next) => {
  const result = await Producto.create(req.body);

  res.status(201).json({
    message: 'Producto creado exitosamente',
    IdProducto: result.insertId
  });
});

const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await Producto.update(id, req.body);

  if (result.affectedRows === 0) {
    return next(new CustomError('Producto no encontrado para actualizar', 404));
  }

  res.json({ message: 'Producto actualizado exitosamente' });
});

const deleteProducto = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await Producto.delete(id);

  if (result.affectedRows === 0) {
    return next(new CustomError('Producto no encontrado para eliminar', 404));
  }

  res.json({ message: 'Producto eliminado exitosamente' });
});

const aplicarDescuentoMarca = catchAsync(async (req, res, next) => {
  const { marca, porcentaje } = req.body;

  if (!marca || !porcentaje) {
    return next(new CustomError('La marca y el porcentaje son obligatorios', 400));
  }

  // El porcentaje no debe ser mayor a 100 ni menor a 0
  if (porcentaje <= 0 || porcentaje > 100) {
    return next(new CustomError('El porcentaje debe estar entre 1 y 100', 400));
  }

  await Producto.aplicarDescuentoMarca(marca, porcentaje);

  res.json({
    message: `Descuento del ${porcentaje}% aplicado exitosamente a la marca ${marca}. Revisa el log del sistema en la BD.`
  });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProducto,
  aplicarDescuentoMarca
};