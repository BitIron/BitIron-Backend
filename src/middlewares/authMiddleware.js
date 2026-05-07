const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

const SECRET_KEY = process.env.JWT_SECRET || 'super_secreto_bitiron_123';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verificar que exista el header Authorization
    if (!authHeader) {
        return next(new CustomError('Acceso denegado. No se proporcionó token.', 401));
    }

    // Extraer token del formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new CustomError('Formato de token inválido.', 401));
    }

    try {
        // Verificar firma y expiración del token
        const datosDescifrados = jwt.verify(token, SECRET_KEY);
        
        // Inyectar los datos en el request para uso en el controlador
        req.usuario = datosDescifrados;
        next();
    } catch (error) {
        return next(new CustomError('Token inválido o expirado.', 403));
    }
};

const esAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') { 
        return next(new CustomError('Acceso denegado: Se requieren permisos de Administrador para esta acción.', 403));
    }
    next();
};

module.exports = {
    verificarToken,
    esAdmin
};
