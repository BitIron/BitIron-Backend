const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registroValidator, loginValidator } = require('../validators/authValidator'); // Importamos los validadores

const authController = require('../controllers/authController');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limita cada IP a 5 peticiones
    message: { error: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, inténtalo de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rutas de autenticación con validaciones inyectadas
router.post('/registro', registroValidator, authController.registro);

router.post('/login', loginLimiter, loginValidator, authController.login);

module.exports = router;
