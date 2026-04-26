const Categoria = require('../models/categoriaModel');

// Obtener todas las categorías
const getAll = async (req, res) => {
  try {
    const rows = await Categoria.getAll();
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
    const rows = await Categoria.getById(id);

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
    const { Nombre } = req.body;

    // Validación básica
    if (!Nombre) {
      return res.status(400).json({ message: 'El campo Nombre es obligatorio' });
    }

    const result = await Categoria.create(req.body);

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
    const { Nombre } = req.body;

    // Validación básica
    if (!Nombre) {
      return res.status(400).json({ message: 'El campo Nombre es obligatorio' });
    }

    const result = await Categoria.update(id, req.body);

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
    const count = await Categoria.countProductos(id);

    if (count > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar la categoría porque tiene productos asociados. Reasigne o elimine los productos primero.'
      });
    }

    // 2. Si no hay productos, procedemos a eliminar
    const result = await Categoria.delete(id);

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