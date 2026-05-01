const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limita cada IP a 5 peticiones por 'window' (por 15 minutos)
    message: { error: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, inténtalo de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rutas de autenticación
router.post('/registro', authController.registro);
router.post('/login', loginLimiter, authController.login);

module.exports = router;
