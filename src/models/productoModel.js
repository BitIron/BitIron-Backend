const pool = require('../config/db');

const getAll = async (filtros = {}) => {
  const { nombre, idCategoria } = filtros;
  let query = `
    SELECT P.*, C.Nombre AS NombreCategoria 
    FROM PRODUCTO P
    LEFT JOIN CATEGORIA C ON P.IdCategoria = C.IdCategoria
    WHERE 1=1
  `;
  const params = [];

  if (nombre) {
    query += ` AND P.Nombre LIKE ?`;
    params.push(`%${nombre}%`);
  }

  if (idCategoria) {
    query += ` AND P.IdCategoria = ?`;
    params.push(idCategoria);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(`
    SELECT P.*, C.Nombre AS NombreCategoria 
    FROM PRODUCTO P
    LEFT JOIN CATEGORIA C ON P.IdCategoria = C.IdCategoria
    WHERE P.IdProducto = ?
  `, [id]);
  return rows;
};

const create = async (data) => {
  const {
    Nombre, Descripcion, Precio, Stock, Imagen_Url,
    Genero, Marca, ObjetivoRecomendado, Activo, IdCategoria
  } = data;
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
  return result;
};

const update = async (id, data) => {
  const {
    Nombre, Descripcion, Precio, Stock, Imagen_Url,
    Genero, Marca, ObjetivoRecomendado, Activo, IdCategoria
  } = data;
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
  return result;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM PRODUCTO WHERE IdProducto = ?', [id]);
  return result;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove
};
