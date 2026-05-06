const { body, param, validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            error: 'Errores de validación en los datos de la asesoría.',
            detalles: errores.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        });
    }
    next();
};

const asesoriaCreateValidator = [
    body('IdCliente', 'El IdCliente es obligatorio y debe ser un número.').isInt(),
    body('TipoPlan', 'El tipo de plan es obligatorio.').notEmpty(),
    body('PrecioMensual', 'El precio mensual debe ser un número positivo.').isFloat({ min: 0 }),
    body('FechaInicio', 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD).').optional().isISO8601(),
    body('PagadoAlDia', 'El estado de pago debe ser un booleano.').optional().isBoolean(),
    validarCampos
];

const asesoriaUpdateValidator = [
    param('id', 'ID de asesoría no válido.').isInt(),
    body('TipoPlan', 'El tipo de plan no puede estar vacío.').optional().notEmpty(),
    body('PrecioMensual', 'El precio mensual debe ser un número positivo.').optional().isFloat({ min: 0 }),
    body('PagadoAlDia', 'El estado de pago debe ser un booleano.').optional().isBoolean(),
    validarCampos
];

module.exports = {
    asesoriaCreateValidator,
    asesoriaUpdateValidator
};
