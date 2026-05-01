const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'super_secreto_bitiron_123';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verificar que exista el header Authorization
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }

    // Extraer token del formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido.' });
    }

    try {
        // Verificar firma y expiración del token
        const datosDescifrados = jwt.verify(token, SECRET_KEY);
        
        // Inyectar los datos en el request para uso en el controlador
        req.usuario = datosDescifrados;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

const esAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') { 
        return res.status(403).json({ 
            error: 'Acceso denegado: Se requieren permisos de Administrador para esta acción.' 
        });
    }
    next();
};

module.exports = {
    verificarToken,
    esAdmin
};
