/**
 * Valida que la contraseña cumpla las reglas de seguridad de BitIron:
 * - Mínimo 6 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * @param {string} password
 * @returns {true}
 * @throws {Error}
 */
const validarPassword = (password) => {
  if (!password || password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('La contraseña debe contener al menos una letra mayúscula');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('La contraseña debe contener al menos un número');
  }
  return true;
};

module.exports = { validarPassword };
