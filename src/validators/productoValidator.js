const { body, param } = require('express-validator');
const validateResult = require('../middlewares/validateResult');

const productoCreateValidator = [
    body('Nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('Precio')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor a 0'),
    body('Stock')
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo'),
    body('IdCategoria')
        .isInt().withMessage('El ID de categoría debe ser un número válido'),
    validateResult
];

const productoUpdateValidator = [
    param('id').isInt().withMessage('ID de producto no válido en la URL'),
    body('Nombre').optional().trim().isLength({ min: 3 }),
    body('Precio').optional().isFloat({ min: 0.01 }),
    body('Stock').optional().isInt({ min: 0 }),
    body('IdCategoria').optional().isInt(),
    validateResult
];

const descuentoValidator = [
    body('marca')
        .trim()
        .notEmpty().withMessage('La marca es obligatoria'),
    body('porcentaje')
        .isFloat({ min: 1, max: 100 }).withMessage('El porcentaje debe estar entre 1 y 100'),
    validateResult
];

module.exports = { productoCreateValidator, productoUpdateValidator, descuentoValidator };

