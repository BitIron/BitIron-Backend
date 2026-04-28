const pool = require('../config/db');

const procesarCheckout = async (idCliente) => {
    // 1. Obtener una conexión exclusiva del pool para la transacción
    const connection = await pool.getConnection();

    try {
        // Iniciar la transacción SQL
        await connection.beginTransaction();

        // 2. Leer todo lo que el cliente tiene en el CARRITO
        const [itemsCarrito] = await connection.query(
            'SELECT IdProducto, Cantidad FROM CARRITO WHERE IdCliente = ?',
            [idCliente]
        );

        if (itemsCarrito.length === 0) {
            throw new Error('El carrito está vacío. No se puede procesar el checkout.');
        }

        let totalPagar = 0;
        const detalles = [];

        // 3. Validar precios y stock consultando la tabla PRODUCTO
        for (const item of itemsCarrito) {
            const [productoRows] = await connection.query(
                'SELECT Precio, Stock FROM PRODUCTO WHERE IdProducto = ? FOR UPDATE',
                [item.IdProducto] // FOR UPDATE bloquea la fila para evitar concurrencia
            );

            if (productoRows.length === 0) {
                throw new Error(`El producto con ID ${item.IdProducto} ya no existe.`);
            }

            const producto = productoRows[0];

            if (producto.Stock < item.Cantidad) {
                throw new Error(`Stock insuficiente para el producto ID ${item.IdProducto}. Stock actual: ${producto.Stock}`);
            }

            // Calcular el subtotal de este producto con el precio real de DB
            const subtotal = producto.Precio * item.Cantidad;
            totalPagar += subtotal;

            // Guardar info para insertar luego en DETALLE_PEDIDO
            detalles.push({
                IdProducto: item.IdProducto,
                Cantidad: item.Cantidad,
                PrecioUnitario: producto.Precio
            });
        }

        // 4. Hacer el INSERT en la tabla PEDIDO
        const [resultPedido] = await connection.query(
            'INSERT INTO PEDIDO (IdCliente, TotalPagar) VALUES (?, ?)',
            [idCliente, totalPagar]
        );
        const idPedido = resultPedido.insertId;

        // 5. & 6. Bucle para insertar en DETALLE_PEDIDO y restar Stock en PRODUCTO
        for (const detalle of detalles) {
            // Insertar detalle
            await connection.query(
                'INSERT INTO DETALLE_PEDIDO (IdPedido, IdProducto, Cantidad, PrecioUnitario) VALUES (?, ?, ?, ?)',
                [idPedido, detalle.IdProducto, detalle.Cantidad, detalle.PrecioUnitario]
            );

            // Restar stock
            await connection.query(
                'UPDATE PRODUCTO SET Stock = Stock - ? WHERE IdProducto = ?',
                [detalle.Cantidad, detalle.IdProducto]
            );
        }

        // 7. Hacer un DELETE del CARRITO de ese cliente
        await connection.query(
            'DELETE FROM CARRITO WHERE IdCliente = ?',
            [idCliente]
        );

        // 8. Confirmar la transacción
        await connection.commit();
        
        return idPedido;

    } catch (error) {
        // Si cualquier cosa falla, deshacer todos los cambios
        await connection.rollback();
        throw error;
    } finally {
        // Siempre liberar la conexión de vuelta al pool
        connection.release();
    }
};

const obtenerPedidosPorCliente = async (idCliente) => {
    // 1. Obtenemos los pedidos principales del cliente (ordenados por el más reciente)
    const [pedidos] = await pool.query(
        'SELECT IdPedido, FechaPedido, TotalPagar FROM PEDIDO WHERE IdCliente = ? ORDER BY FechaPedido DESC',
        [idCliente]
    );

    // Si no tiene pedidos, devolvemos un array vacío enseguida
    if (pedidos.length === 0) return [];

    // 2. Por cada pedido, buscamos sus detalles uniendo con la tabla PRODUCTO
    for (let pedido of pedidos) {
        const [detalles] = await pool.query(`
            SELECT 
                dp.Cantidad, 
                dp.PrecioUnitario, 
                p.Nombre, 
                p.Imagen_Url 
            FROM DETALLE_PEDIDO dp
            JOIN PRODUCTO p ON dp.IdProducto = p.IdProducto
            WHERE dp.IdPedido = ?
        `, [pedido.IdPedido]);
        
        // Agregamos el array de productos dentro del objeto pedido
        pedido.productos = detalles;
    }

    return pedidos;
};

module.exports = {
    procesarCheckout,
    obtenerPedidosPorCliente
};
