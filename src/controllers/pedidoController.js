const Pedido = require('../models/pedidoModel');

const realizarCheckout = async (req, res) => {
    try {
        const { IdCliente } = req.body;

        if (!IdCliente) {
            return res.status(400).json({ message: 'El IdCliente es obligatorio.' });
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
            return res.status(400).json({ error: error.message });
        }

        // Si es un error inesperado (base de datos caída, etc.), devolvemos 500
        res.status(500).json({ error: 'Error interno del servidor al procesar el pedido.' });
    }
};

const obtenerHistorial = async (req, res) => {
    try {
        const { idCliente } = req.params;

        // Llamamos al modelo para traer el historial completo
        const historial = await Pedido.obtenerPedidosPorCliente(idCliente);

        res.json(historial);
    } catch (error) {
        console.error('Error al obtener el historial de pedidos:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el historial.' });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const { nuevoEstado } = req.body;

        const estadosValidos = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({ error: 'Estado no válido.' });
        }

        const actualizado = await Pedido.actualizarEstadoPedido(idPedido, nuevoEstado);

        if (!actualizado) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }

        res.json({ success: true, message: 'Estado del pedido actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
};

module.exports = {
    realizarCheckout,
    obtenerHistorial,
    actualizarEstado
};
