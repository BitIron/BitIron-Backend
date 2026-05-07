const { validationResult } = require('express-validator');
const CustomError = require('../utils/CustomError');

/**
 * Middleware que verifica si hay errores de validación.
 */
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        return next(new CustomError(errorMessages, 400));
    }
    next();
};

module.exports = validateResult;
