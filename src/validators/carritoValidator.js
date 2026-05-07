const { body } = require('express-validator');
const validateResult = require('../middlewares/validateResult');

const validateCarrito = [
    body('IdCliente').optional().isInt().withMessage('IdCliente debe ser un número'),
    body('IdProducto').isInt().withMessage('IdProducto es obligatorio y debe ser un número'),
    body('Cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
    validateResult
];

module.exports = { validateCarrito };
