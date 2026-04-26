const Producto = require('../models/productoModel');

const getAll = async (req, res) => {
  try {
    const { nombre, idCategoria } = req.query;
    const filtros = { nombre, idCategoria };
    const rows = await Producto.getAll(filtros);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Producto.getById(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await Producto.create(req.body);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      IdProducto: result.insertId
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Producto.update(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
    }

    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Producto.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProducto
};