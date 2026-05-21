const { body } = require('express-validator');
const validateResult = require('../middlewares/validateResult');

const registroValidator = [
    body('nombreCompleto')
        .trim()
        .notEmpty().withMessage('El nombre completo es obligatorio'),
    body('email')
        .trim()
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateResult
];

const loginValidator = [
    body('email')
        .trim()
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    validateResult
];

module.exports = { registroValidator, loginValidator };

