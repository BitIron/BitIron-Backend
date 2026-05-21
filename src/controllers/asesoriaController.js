const pool = require('../config/db');
const CustomError = require('../utils/CustomError');
const catchAsync = require('../utils/catchAsync');

const asesoriaController = {
  // Obtener todas las asesorías (con paginación)
  getAll: catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNum - 1) * limitNum;

    // 1. Obtener el total
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM ASESORIA');

    // 2. Obtener los datos con JOIN, LIMIT y OFFSET
    const [rows] = await pool.query(`
      SELECT a.*, c.NombreCompleto as NombreCliente 
      FROM ASESORIA a 
      JOIN CLIENTE c ON a.IdCliente = c.IdCliente
      ORDER BY a.FechaInicio DESC
      LIMIT ? OFFSET ?
    `, [limitNum, offset]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: rows,
      meta: {
        totalItems: total,
        totalPages: totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum
      }
    });
  }),

  // Obtener una asesoría por ID
  getById: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM ASESORIA WHERE IdAsesoria = ?', [id]);
    if (rows.length === 0) return next(new CustomError('Asesoría no encontrada', 404));
    res.json(rows[0]);
  }),

  // Crear una nueva asesoría
  create: catchAsync(async (req, res, next) => {
    const { IdCliente, TipoPlan, PrecioMensual, FechaInicio, PagadoAlDia } = req.body;
    const [result] = await pool.query(
      'INSERT INTO ASESORIA (IdCliente, TipoPlan, PrecioMensual, FechaInicio, PagadoAlDia) VALUES (?, ?, ?, ?, ?)',
      [IdCliente, TipoPlan, PrecioMensual, FechaInicio || new Date(), PagadoAlDia || false]
    );
    res.status(201).json({ id: result.insertId, message: 'Asesoría creada correctamente' });
  }),

  // Actualizar una asesoría
  update: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { TipoPlan, PrecioMensual, PagadoAlDia } = req.body;
    const [result] = await pool.query(
      'UPDATE ASESORIA SET TipoPlan = ?, PrecioMensual = ?, PagadoAlDia = ? WHERE IdAsesoria = ?',
      [TipoPlan, PrecioMensual, PagadoAlDia, id]
    );
    if (result.affectedRows === 0) return next(new CustomError('Asesoría no encontrada', 404));
    res.json({ message: 'Asesoría actualizada correctamente' });
  }),

  // Eliminar una asesoría
  remove: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM ASESORIA WHERE IdAsesoria = ?', [id]);
    if (result.affectedRows === 0) return next(new CustomError('Asesoría no encontrada', 404));
    res.json({ message: 'Asesoría eliminada correctamente' });
  })
};

module.exports = asesoriaController;
