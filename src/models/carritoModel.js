const pool = require('../config/db');

const Carrito = {
    add: async (IdCliente, IdProducto, Cantidad) => {
        // 1. Verificar stock disponible
        const [productos] = await pool.query('SELECT Stock FROM PRODUCTO WHERE IdProducto = ?', [IdProducto]);
        if (productos.length === 0) {
            throw new Error("Producto no encontrado");
        }
        if (productos[0].Stock < Cantidad) {
            throw new Error(`Stock insuficiente. Solo quedan ${productos[0].Stock} unidades en inventario.`);
        }

        // 2. Insertar si hay stock
        const [result] = await pool.query(
            'INSERT INTO CARRITO (IdCliente, IdProducto, Cantidad) VALUES (?, ?, ?)',
            [IdCliente, IdProducto, Cantidad]
        );
        return result;
    },

    getByCliente: async (idCliente) => {
        const [rows] = await pool.query(`
      SELECT C.*, P.Nombre, P.Precio, P.Imagen_Url
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
        // 1. Saber qué producto es
        const [items] = await pool.query('SELECT IdProducto FROM CARRITO WHERE IdCarrito = ?', [idCarrito]);
        if (items.length === 0) {
            throw new Error("Producto no encontrado en el carrito");
        }
        const idProducto = items[0].IdProducto;

        // 2. Verificar stock
        const [productos] = await pool.query('SELECT Stock FROM PRODUCTO WHERE IdProducto = ?', [idProducto]);
        if (productos.length > 0 && productos[0].Stock < cantidad) {
            throw new Error(`Stock insuficiente. Solo quedan ${productos[0].Stock} unidades en inventario.`);
        }

        // 3. Actualizar cantidad
        const [result] = await pool.query(
            'UPDATE CARRITO SET Cantidad = ? WHERE IdCarrito = ?',
            [cantidad, idCarrito]
        );
        return result;
    },

    clear: async (idCliente) => {
        const [result] = await pool.query(
            'DELETE FROM CARRITO WHERE IdCliente = ?',
            [idCliente]
        );
        return result;
    }

};

module.exports = Carrito;