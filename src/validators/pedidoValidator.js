const { body } = require('express-validator');
const validateResult = require('../middlewares/validateResult');

const validateCheckout = [
    body('IdCliente').isInt().withMessage('El IdCliente es obligatorio y debe ser un número'),
    validateResult
];

const validateEstadoPedido = [
    body('nuevoEstado')
        .isIn(['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'])
        .withMessage('Estado de pedido no válido. Los estados permitidos son: Pendiente, Pagado, Enviado, Entregado, Cancelado'),
    validateResult
];

module.exports = { validateCheckout, validateEstadoPedido };
