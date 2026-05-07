const Pedido = require('../models/pedidoModel');
const CustomError = require('../utils/CustomError');

const realizarCheckout = async (req, res, next) => {
    try {
        const { IdCliente } = req.body;

        if (!IdCliente) {
            return next(new CustomError('El IdCliente es obligatorio.', 400));
        }

        // Llamamos a la "magia" en el modelo (la transacción SQL)
        const idPedido = await Pedido.procesarCheckout(IdCliente);

        res.status(201).json({
            message: 'Checkout procesado con éxito. Pedido generado.',
            IdPedido: idPedido
        });

    } catch (error) {
        console.error('Error durante el checkout:', error);

        // Si es un error de negocio (carrito vacío, stock insuficiente) devolvemos un 400
        if (
            error.message.includes('vacío') ||
            error.message.includes('Stock insuficiente') ||
            error.message.includes('ya no existe')
        ) {
            return next(new CustomError(error.message, 400));
        }

        // Si es un error inesperado (base de datos caída, etc.), devolvemos 500
        return next(new CustomError('Error interno del servidor al procesar el pedido.', 500));
    }
};

const obtenerHistorial = async (req, res, next) => {
    try {
        const { idCliente } = req.params;

        // Llamamos al modelo para traer el historial completo
        const historial = await Pedido.obtenerPedidosPorCliente(idCliente);

        res.json(historial);
    } catch (error) {
        console.error('Error al obtener el historial de pedidos:', error);
        return next(new CustomError('Error interno del servidor al obtener el historial.', 500));
    }
};

const actualizarEstado = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        return next(new CustomError('Error interno del servidor.', 500));
    }
};

module.exports = {
    realizarCheckout,
    obtenerHistorial,
    actualizarEstado
};
