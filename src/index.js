require('dotenv').config();
const checkEnv = require('./config/checkEnv');
checkEnv();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const planRoutes = require('./routes/planRoutes');
const authRoutes = require('./routes/authRoutes');
const asesoriaRoutes = require('./routes/asesoriaRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ─── Rate Limiting Global ─────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones desde esta IP. Por favor, inténtalo de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/planes', planRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/asesorias', asesoriaRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
      await pool.query('SELECT 1');
      console.log('✅ Conexión exitosa a la base de datos Bit-Iron');
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error);
    }
  });
}

module.exports = app;