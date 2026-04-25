const pool = require('../config/db');

// Obtener todas las categorías
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM CATEGORIA');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener una categoría por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM CATEGORIA WHERE IdCategoria = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear una nueva categoría
const create = async (req, res) => {
  try {
    const { Nombre, Descripcion, Imagen_Url } = req.body;

    // Validación básica
    if (!Nombre) {
      return res.status(400).json({ message: 'El campo Nombre es obligatorio' });
    }

    const [result] = await pool.query(
      'INSERT INTO CATEGORIA (Nombre, Descripcion, Imagen_Url) VALUES (?, ?, ?)',
      [Nombre, Descripcion || null, Imagen_Url || null]
    );

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar una categoría existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Imagen_Url } = req.body;

    // Validación básica
    if (!Nombre) {
      return res.status(400).json({ message: 'El campo Nombre es obligatorio' });
    }

    const [result] = await pool.query(
      'UPDATE CATEGORIA SET Nombre = ?, Descripcion = ?, Imagen_Url = ? WHERE IdCategoria = ?',
      [Nombre, Descripcion || null, Imagen_Url || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar una categoría (con Borrado Controlado - Lógica de Negocio)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Lógica de negocio: Verificar si la categoría tiene productos asociados
    const [productosAsociados] = await pool.query(
      'SELECT COUNT(*) as count FROM PRODUCTO WHERE IdCategoria = ?',
      [id]
    );

    if (productosAsociados[0].count > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar la categoría porque tiene productos asociados. Reasigne o elimine los productos primero.'
      });
    }

    // 2. Si no hay productos, procedemos a eliminar
    const [result] = await pool.query('DELETE FROM CATEGORIA WHERE IdCategoria = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove
};