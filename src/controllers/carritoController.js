const Carrito = require('../models/carritoModel');

const getCarrito = async (req, res) => {
    try {
        const { idCliente } = req.params;
        const items = await Carrito.getByCliente(idCliente);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const agregarAlCarrito = async (req, res) => {
    try {
        const { IdCliente, IdProducto, Cantidad } = req.body;
        await Carrito.add(IdCliente, IdProducto, Cantidad);
        res.status(201).json({ message: "Agregado al carrito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarDelCarrito = async (req, res) => {
    try {
        const { id } = req.params; // IdCarrito a eliminar
        const result = await Carrito.remove(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        
        res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarCantidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { Cantidad } = req.body;
        
        const result = await Carrito.updateCantidad(id, Cantidad);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        
        res.json({ message: "Cantidad actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCarrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad };