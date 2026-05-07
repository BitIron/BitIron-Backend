const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');

const adminController = {
  getDashboardStats: catchAsync(async (req, res, next) => {
    // 1. Resumen general (Ventas totales, pedidos totales, usuarios totales)
    const [generalStats] = await pool.query(`
      SELECT 
        (SELECT SUM(TotalPagar) FROM PEDIDO) as IngresosTotales,
        (SELECT COUNT(*) FROM PEDIDO) as TotalPedidos,
        (SELECT COUNT(*) FROM CLIENTE WHERE Rol = 'cliente') as TotalClientes
    `);

    // 2. Alerta de Stock Bajo (menos de 10 unidades)
    const [lowStock] = await pool.query(`
      SELECT Nombre, Stock, Marca 
      FROM PRODUCTO 
      WHERE Stock < 10 
      ORDER BY Stock ASC
    `);

    // 3. Top 5 Productos más vendidos
    const [topProducts] = await pool.query(`
      SELECT p.Nombre, SUM(dp.Cantidad) as UnidadesVendidas
      FROM DETALLE_PEDIDO dp
      JOIN PRODUCTO p ON dp.IdProducto = p.IdProducto
      GROUP BY dp.IdProducto
      ORDER BY UnidadesVendidas DESC
      LIMIT 5
    `);

    res.json({
      resumen: generalStats[0],
      alertasStock: lowStock,
      topVentas: topProducts
    });
  })
};

module.exports = adminController;

