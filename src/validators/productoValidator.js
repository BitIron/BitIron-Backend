const { body, param, validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            error: 'Errores de validación en los datos del producto.',
            detalles: errores.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        });
    }
    next();
};

const productoCreateValidator = [
    body('Nombre', 'El nombre es obligatorio y debe tener un máximo de 255 caracteres.').notEmpty().isLength({ max: 255 }),
    body('Precio', 'El precio debe ser un número positivo.').isFloat({ min: 0 }),
    body('Stock', 'El stock debe ser un número entero no negativo.').isInt({ min: 0 }),
    body('Genero', 'El género debe ser hombre, mujer o unisex.').isIn(['hombre', 'mujer', 'unisex']),
    body('IdCategoria', 'La categoría es obligatoria y debe ser un número.').isInt(),
    validarCampos
];

const productoUpdateValidator = [
    param('id', 'ID de producto no válido.').isInt(),
    body('Nombre', 'El nombre debe tener un máximo de 255 caracteres.').optional().isLength({ max: 255 }),
    body('Precio', 'El precio debe ser un número positivo.').optional().isFloat({ min: 0 }),
    body('Stock', 'El stock debe ser un número entero no negativo.').optional().isInt({ min: 0 }),
    body('Genero', 'El género debe ser hombre, mujer o unisex.').optional().isIn(['hombre', 'mujer', 'unisex']),
    body('IdCategoria', 'La categoría debe ser un número.').optional().isInt(),
    validarCampos
];

const descuentoValidator = [
    body('marca', 'La marca es obligatoria.').notEmpty(),
    body('porcentaje', 'El porcentaje debe ser un número entre 0 y 100.').isFloat({ min: 0, max: 100 }),
    validarCampos
];

module.exports = {
    productoCreateValidator,
    productoUpdateValidator,
    descuentoValidator
};
