const errorHandler = (err, req, res, next) => {
    console.error("🚨 ERROR INTERCEPTADO:");
    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    const mensaje = err.message || 'Error interno del servidor. Por favor, inténtalo más tarde.';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        error: mensaje
    });
};

module.exports = errorHandler;