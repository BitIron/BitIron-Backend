const pool = require('../config/db');
const CustomError = require('../utils/CustomError');

const asesoriaController = {
  // Obtener todas las asesorías
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.NombreCompleto as NombreCliente 
        FROM ASESORIA a 
        JOIN CLIENTE c ON a.IdCliente = c.IdCliente
      `);
      res.json(rows);
    } catch (error) {
      return next(new CustomError('Error al obtener asesorías', 500));
    }
  },

  // Obtener una asesoría por ID
  getById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM ASESORIA WHERE IdAsesoria = ?', [id]);
      if (rows.length === 0) return next(new CustomError('Asesoría no encontrada', 404));
      res.json(rows[0]);
    } catch (error) {
      return next(new CustomError('Error al obtener la asesoría', 500));
    }
  },

  // Crear una nueva asesoría
  create: async (req, res, next) => {
    const { IdCliente, TipoPlan, PrecioMensual, FechaInicio, PagadoAlDia } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO ASESORIA (IdCliente, TipoPlan, PrecioMensual, FechaInicio, PagadoAlDia) VALUES (?, ?, ?, ?, ?)',
        [IdCliente, TipoPlan, PrecioMensual, FechaInicio || new Date(), PagadoAlDia || false]
      );
      res.status(201).json({ id: result.insertId, message: 'Asesoría creada correctamente' });
    } catch (error) {
      return next(new CustomError('Error al crear la asesoría', 500));
    }
  },

  // Actualizar una asesoría
  update: async (req, res, next) => {
    const { id } = req.params;
    const { TipoPlan, PrecioMensual, PagadoAlDia } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE ASESORIA SET TipoPlan = ?, PrecioMensual = ?, PagadoAlDia = ? WHERE IdAsesoria = ?',
        [TipoPlan, PrecioMensual, PagadoAlDia, id]
      );
      if (result.affectedRows === 0) return next(new CustomError('Asesoría no encontrada', 404));
      res.json({ message: 'Asesoría actualizada correctamente' });
    } catch (error) {
      return next(new CustomError('Error al actualizar la asesoría', 500));
    }
  },

  // Eliminar una asesoría
  remove: async (req, res, next) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM ASESORIA WHERE IdAsesoria = ?', [id]);
      if (result.affectedRows === 0) return next(new CustomError('Asesoría no encontrada', 404));
      res.json({ message: 'Asesoría eliminada correctamente' });
    } catch (error) {
      return next(new CustomError('Error al eliminar la asesoría', 500));
    }
  }
};

module.exports = asesoriaController;
