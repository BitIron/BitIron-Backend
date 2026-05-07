/**
 * Envuelve una función asíncrona para capturar errores y pasarlos al middleware de error centralizado.
 * Elimina la necesidad de escribir bloques try-catch repetitivos en cada controlador.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
