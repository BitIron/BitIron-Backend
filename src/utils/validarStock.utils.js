/**
 * Valida que la cantidad y el stock sean valores correctos para el carrito.
 * Lógica de negocio: no se puede añadir al carrito más unidades de las que hay en stock.
 * @param {number} cantidad - Unidades que el usuario quiere añadir
 * @param {number} stock - Stock disponible del producto en la BD
 * @returns {true}
 * @throws {Error}
 */
const validarStock = (cantidad, stock) => {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new Error('La cantidad debe ser un número entero positivo');
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock no puede ser negativo');
  }
  if (cantidad > stock) {
    throw new Error(`Stock insuficiente. Solo quedan ${stock} unidades en inventario`);
  }
  return true;
};

module.exports = { validarStock };
