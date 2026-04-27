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

module.exports = { getCarrito, agregarAlCarrito };