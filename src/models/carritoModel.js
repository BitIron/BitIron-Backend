const pool = require('../config/db');

const Carrito = {
    add: async (IdCliente, IdProducto, Cantidad) => {
        const [result] = await pool.query(
            'INSERT INTO CARRITO (IdCliente, IdProducto, Cantidad) VALUES (?, ?, ?)',
            [IdCliente, IdProducto, Cantidad]
        );
        return result;
    },

    getByCliente: async (idCliente) => {
        const [rows] = await pool.query(`
      SELECT C.*, P.Nombre, P.Precio 
      FROM CARRITO C 
      JOIN PRODUCTO P ON C.IdProducto = P.IdProducto 
      WHERE C.IdCliente = ?
    `, [idCliente]);
        return rows;
    }

};

module.exports = Carrito;