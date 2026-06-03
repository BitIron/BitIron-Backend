const pool = require('../config/db');
const getAll = async (filtros = {}, paginacion = { limit: 10, offset: 0 }) => {
  const { reseña, idProducto } = filtros;
  const { limit, offset } = paginacion;
    let baseQuery = `
    FROM RESEÑAS R
    JOIN PRODUCTO P ON R.IdProducto = P.IdProducto
    WHERE 1=1
  `;
  const params = [];
  if (reseña) {
    baseQuery += ' AND R.Reseña LIKE ?';
    params.push(`%${reseña}%`);
  }
  if (idProducto) {
    baseQuery += ' AND R.IdProducto = ?';
    params.push(idProducto);
  }
    const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const total = countResult[0].total;
    const dataQuery = `SELECT R.*, P.Nombre AS NombreProducto ${baseQuery} LIMIT ? OFFSET ?`;
    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query(dataQuery, dataParams);
    return {
        total,
        rows
    };
};

const getById = async (id) => {
    const [rows] = await pool.query(`
        SELECT R.*, P.Nombre AS NombreProducto 
        FROM RESEÑAS R
        JOIN PRODUCTO P ON R.IdProducto = P.IdProducto
        WHERE R.IdResena = ?
    `, [id]);
    return rows;
};
const create = async (data) => {
    const { IdProducto, IdCliente, Calificacion, Comentario } = data;
    const [result] = await pool.query(  
        `INSERT INTO RESEÑAS (IdProducto, IdCliente, Calificacion, Comentario)
         VALUES (?, ?, ?, ?)`,
        [IdProducto, IdCliente, Calificacion, Comentario]
    );
    return result.insertId;
};

const update = async (id, data) => {
    const { Calificacion, Comentario } = data;
    const [result] = await pool.query(
        `UPDATE RESEÑAS SET Calificacion = ?, Comentario = ? WHERE IdResena = ?`,
        [Calificacion, Comentario, id]
    );
    return result.affectedRows;
};
const deleteResena = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM RESEÑAS WHERE IdResena = ?`,
        [id]
    );
    return result.affectedRows;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteResena
};

