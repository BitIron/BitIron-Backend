const pool = require('../config/db');

const getAll = async (filtros = {}, paginacion = { limit: 10, offset: 0 }) => {
  const { nombre, idCategoria } = filtros;
  const { limit, offset } = paginacion;

  let baseQuery = `
    FROM PRODUCTO P
    LEFT JOIN CATEGORIA C ON P.IdCategoria = C.IdCategoria
    WHERE 1=1
  `;
  const params = [];

  if (nombre) {
    baseQuery += ` AND P.Nombre LIKE ?`;
    params.push(`%${nombre}%`);
  }

  if (idCategoria) {
    baseQuery += ` AND P.IdCategoria = ?`;
    params.push(idCategoria);
  }

  // 1. Obtener el total de registros que coinciden con los filtros (para los metadatos)
  const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
  const total = countResult[0].total;

  // 2. Obtener solo los registros de esta página
  let dataQuery = `SELECT P.*, C.Nombre AS NombreCategoria ${baseQuery} LIMIT ? OFFSET ?`;
  
  // Clonamos el array de parámetros y añadimos limit y offset al final
  // Se convierten a Number para que el driver de mysql los ponga sin comillas y no falle la sintaxis
  const dataParams = [...params, Number(limit), Number(offset)];

  const [rows] = await pool.query(dataQuery, dataParams);
  
  return {
    total,
    rows
  };
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
