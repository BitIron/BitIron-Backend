const { body } = require('express-validator');
const validateResult = require('../middlewares/validateResult');

const validateCategoria = [
    body('Nombre')
        .trim()
        .notEmpty().withMessage('El nombre de la categoría es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    validateResult
];

module.exports = { validateCategoria };
