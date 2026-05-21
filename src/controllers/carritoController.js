const Carrito = require('../models/carritoModel');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

const getCarrito = catchAsync(async (req, res, next) => {
    const idCliente = req.usuario.id;
    const items = await Carrito.getByCliente(idCliente);
    res.json(items);
});

const agregarAlCarrito = catchAsync(async (req, res, next) => {
    const IdCliente = req.usuario.id;
    const { IdProducto, Cantidad } = req.body;
    try {
        await Carrito.add(IdCliente, IdProducto, Cantidad);
        res.status(201).json({ message: "Agregado al carrito" });
    } catch (error) {
        if (error.message.includes("Stock insuficiente") || error.message.includes("Producto no encontrado")) {
            return next(new CustomError(error.message, 400));
        }
        throw error;
    }
});

const eliminarDelCarrito = catchAsync(async (req, res, next) => {
    const { id } = req.params; // IdCarrito a eliminar
    const result = await Carrito.remove(id);
    
    if (result.affectedRows === 0) {
        return next(new CustomError("Producto no encontrado en el carrito", 404));
    }
    
    res.json({ message: "Producto eliminado del carrito" });
});

const actualizarCantidad = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { Cantidad } = req.body;
    
    try {
        const result = await Carrito.updateCantidad(id, Cantidad);
        
        if (result.affectedRows === 0) {
            return next(new CustomError("Producto no encontrado en el carrito", 404));
        }
        
        res.json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
        if (error.message.includes("Stock insuficiente") || error.message.includes("Producto no encontrado")) {
            return next(new CustomError(error.message, 400));
        }
        throw error;
    }
});

const vaciarCarrito = catchAsync(async (req, res, next) => {
    const idCliente = req.usuario.id;
    const result = await Carrito.clear(idCliente);
    res.json({ message: "Carrito vaciado correctamente", productosEliminados: result.affectedRows });
});

module.exports = { getCarrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito };