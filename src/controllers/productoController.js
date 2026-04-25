const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT P.*, C.Nombre AS NombreCategoria 
      FROM PRODUCTO P
      LEFT JOIN CATEGORIA C ON P.IdCategoria = C.IdCategoria
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT P.*, C.Nombre AS NombreCategoria 
      FROM PRODUCTO P
      LEFT JOIN CATEGORIA C ON P.IdCategoria = C.IdCategoria
      WHERE P.IdProducto = ?
    `, [id]);

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
    const {
      Nombre, Descripcion, Precio, Stock, Imagen_Url,
      Genero, Marca, ObjetivoRecomendado, Activo, IdCategoria
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO PRODUCTO (
        Nombre, Descripcion, Precio, Stock, Imagen_Url, 
        Genero, Marca, ObjetivoRecomendado, Activo, IdCategoria
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Nombre, Descripcion, Precio, Stock || 0, Imagen_Url,
        Genero || 'unisex', Marca, ObjetivoRecomendado,
        Activo !== undefined ? Activo : true, IdCategoria
      ]
    );

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
    const {
      Nombre, Descripcion, Precio, Stock, Imagen_Url,
      Genero, Marca, ObjetivoRecomendado, Activo, IdCategoria
    } = req.body;

    const [result] = await pool.query(
      `UPDATE PRODUCTO 
       SET Nombre = ?, Descripcion = ?, Precio = ?, Stock = ?, 
           Imagen_Url = ?, Genero = ?, Marca = ?, ObjetivoRecomendado = ?, 
           Activo = ?, IdCategoria = ? 
       WHERE IdProducto = ?`,
      [
        Nombre, Descripcion, Precio, Stock, Imagen_Url,
        Genero, Marca, ObjetivoRecomendado, Activo, IdCategoria, id
      ]
    );

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
    const [result] = await pool.query('DELETE FROM PRODUCTO WHERE IdProducto = ?', [id]);

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