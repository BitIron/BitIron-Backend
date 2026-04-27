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
    },

    remove: async (idCarrito) => {
        const [result] = await pool.query(
            'DELETE FROM CARRITO WHERE IdCarrito = ?',
            [idCarrito]
        );
        return result;
    },

    updateCantidad: async (idCarrito, cantidad) => {
        const [result] = await pool.query(
            'UPDATE CARRITO SET Cantidad = ? WHERE IdCarrito = ?',
            [cantidad, idCarrito]
        );
        return result;
    }

};

module.exports = Carrito;