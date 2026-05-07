const Pedido = require('../models/pedidoModel');
const CustomError = require('../utils/CustomError');
const catchAsync = require('../utils/catchAsync');

const realizarCheckout = catchAsync(async (req, res, next) => {
    const { IdCliente } = req.body;

    if (!IdCliente) {
        return next(new CustomError('El IdCliente es obligatorio.', 400));
    }

    try {
        // Llamamos a la "magia" en el modelo (la transacción SQL)
        const idPedido = await Pedido.procesarCheckout(IdCliente);

        res.status(201).json({
            message: 'Checkout procesado con éxito. Pedido generado.',
            IdPedido: idPedido
        });
    } catch (error) {
        // Si es un error de negocio (carrito vacío, stock insuficiente) devolvemos un 400
        if (
            error.message.includes('vacío') ||
            error.message.includes('Stock insuficiente') ||
            error.message.includes('ya no existe')
        ) {
            return next(new CustomError(error.message, 400));
        }
        // Dejamos que el error de sistema (500) fluya hacia el errorHandler centralizado
        throw error;
    }
});

const obtenerHistorial = catchAsync(async (req, res, next) => {
    const { idCliente } = req.params;

    // Llamamos al modelo para traer el historial completo
    const historial = await Pedido.obtenerPedidosPorCliente(idCliente);

    res.json(historial);
});

const actualizarEstado = catchAsync(async (req, res, next) => {
    const { idPedido } = req.params;
    const { nuevoEstado } = req.body;

    const estadosValidos = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
        return next(new CustomError('Estado no válido.', 400));
    }

    const actualizado = await Pedido.actualizarEstadoPedido(idPedido, nuevoEstado);

    if (!actualizado) {
        return next(new CustomError('Pedido no encontrado.', 404));
    }

    res.json({ success: true, message: 'Estado del pedido actualizado con éxito.' });
});

module.exports = {
    realizarCheckout,
    obtenerHistorial,
    actualizarEstado
};
