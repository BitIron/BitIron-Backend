const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    // Log del error para el desarrollador
    console.error("🚨 ERROR:");
    console.error(err.stack);

    res.status(err.statusCode).json({
        success: false,
        status: err.statusCode,
        error: err.message || 'Error interno del servidor.'
    });
};

module.exports = errorHandler;