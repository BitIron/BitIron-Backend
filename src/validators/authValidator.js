const { body, validationResult } = require('express-validator');

// 1. Interceptor de Errores (Lo que antes estaba en el middleware separado)
const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            error: 'Errores de validación en los datos enviados.',
            detalles: errores.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        });
    }
    next();
};

// 2. Reglas de Validación para Registro
const registroValidator = [
    body('nombreCompleto', 'El nombre es obligatorio y debe tener al menos 3 caracteres.').isLength({ min: 3 }),
    body('email', 'El formato del email no es válido.').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    validarCampos // Llama al interceptor automáticamente
];

// 3. Reglas de Validación para Login
const loginValidator = [
    body('email', 'El formato del email no es válido.').isEmail(),
    body('password', 'La contraseña es obligatoria.').notEmpty(),
    validarCampos // Llama al interceptor automáticamente
];

module.exports = {
    registroValidator,
    loginValidator
};
