const Producto = require('../models/productoModel');

const getAll = async (req, res) => {
  try {
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
      data: result.rows,
      meta: {
        totalItems: result.total,
        totalPages: totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum
      }
    });
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

const aplicarDescuentoMarca = async (req, res) => {
  try {
    const { marca, porcentaje } = req.body;

    if (!marca || !porcentaje) {
      return res.status(400).json({ message: 'La marca y el porcentaje son obligatorios' });
    }

    // El porcentaje no debe ser mayor a 100 ni menor a 0
    if (porcentaje <= 0 || porcentaje > 100) {
      return res.status(400).json({ message: 'El porcentaje debe estar entre 1 y 100' });
    }

    await Producto.aplicarDescuentoMarca(marca, porcentaje);

    res.json({
      message: `Descuento del ${porcentaje}% aplicado exitosamente a la marca ${marca}. Revisa el log del sistema en la BD.`
    });
  } catch (error) {
    console.error('Error al aplicar descuento por marca:', error);
    res.status(500).json({ message: 'Error al aplicar el descuento', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProducto,
  aplicarDescuentoMarca
};