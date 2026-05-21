/**
 * Valida que un porcentaje de descuento esté dentro del rango permitido (1-100).
 * Lógica de negocio del endpoint de descuento por marca (stored procedure).
 * @param {number} porcentaje
 * @returns {true}
 * @throws {Error}
 */
const validarDescuento = (porcentaje) => {
  if (porcentaje === null || porcentaje === undefined || porcentaje === '') {
    throw new Error('El porcentaje de descuento es obligatorio');
  }
  const valor = Number(porcentaje);
  if (isNaN(valor)) {
    throw new Error('El porcentaje debe ser un número');
  }
  if (valor <= 0 || valor > 100) {
    throw new Error('El porcentaje debe estar entre 1 y 100');
  }
  return true;
};

module.exports = { validarDescuento };
