require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const planRoutes = require('./routes/planRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/planes', planRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión exitosa a la base de datos Bit-Iron');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
});