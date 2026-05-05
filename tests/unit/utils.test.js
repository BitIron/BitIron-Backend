const { validarPassword } = require('../../src/utils/validarPassword.utils');
const { validarStock } = require('../../src/utils/validarStock.utils');
const { validarDescuento } = require('../../src/utils/validarDescuento.utils');

// ─── validarPassword ──────────────────────────────────────────────────────────

describe('validarPassword', () => {
  it('debe retornar true para una contraseña válida', () => {
    expect(validarPassword('Admin123')).toBe(true);
  });

  it('debe retornar true con contraseña mínima válida (6 chars, mayus, número)', () => {
    expect(validarPassword('Ab1234')).toBe(true);
  });

  it('debe lanzar error si la contraseña tiene menos de 6 caracteres', () => {
    expect(() => validarPassword('Ab1')).toThrow('La contraseña debe tener al menos 6 caracteres');
  });

  it('debe lanzar error si la contraseña no tiene ninguna mayúscula', () => {
    expect(() => validarPassword('admin123')).toThrow('La contraseña debe contener al menos una letra mayúscula');
  });

  it('debe lanzar error si la contraseña no tiene ningún número', () => {
    expect(() => validarPassword('AdminPass')).toThrow('La contraseña debe contener al menos un número');
  });

  it('debe lanzar error si la contraseña está vacía', () => {
    expect(() => validarPassword('')).toThrow('La contraseña debe tener al menos 6 caracteres');
  });

  it('debe lanzar error si la contraseña es undefined', () => {
    expect(() => validarPassword(undefined)).toThrow('La contraseña debe tener al menos 6 caracteres');
  });
});

// ─── validarStock ─────────────────────────────────────────────────────────────

describe('validarStock', () => {
  it('debe retornar true si la cantidad es menor o igual al stock', () => {
    expect(validarStock(5, 10)).toBe(true);
  });

  it('debe retornar true en el límite exacto (cantidad === stock)', () => {
    expect(validarStock(10, 10)).toBe(true);
  });

  it('debe lanzar error si la cantidad supera el stock disponible', () => {
    expect(() => validarStock(11, 10)).toThrow('Stock insuficiente. Solo quedan 10 unidades en inventario');
  });

  it('debe lanzar error si la cantidad es 0', () => {
    expect(() => validarStock(0, 10)).toThrow('La cantidad debe ser un número entero positivo');
  });

  it('debe lanzar error si la cantidad es negativa', () => {
    expect(() => validarStock(-3, 10)).toThrow('La cantidad debe ser un número entero positivo');
  });

  it('debe lanzar error si el stock es negativo', () => {
    expect(() => validarStock(1, -5)).toThrow('El stock no puede ser negativo');
  });

  it('debe retornar true con stock igual a 1 y cantidad 1', () => {
    expect(validarStock(1, 1)).toBe(true);
  });
});

// ─── validarDescuento ─────────────────────────────────────────────────────────

describe('validarDescuento', () => {
  it('debe retornar true para un descuento válido del 10%', () => {
    expect(validarDescuento(10)).toBe(true);
  });

  it('debe retornar true en el límite inferior (1%)', () => {
    expect(validarDescuento(1)).toBe(true);
  });

  it('debe retornar true en el límite superior (100%)', () => {
    expect(validarDescuento(100)).toBe(true);
  });

  it('debe lanzar error si el porcentaje es mayor a 100', () => {
    expect(() => validarDescuento(101)).toThrow('El porcentaje debe estar entre 1 y 100');
  });

  it('debe lanzar error si el porcentaje es 0', () => {
    expect(() => validarDescuento(0)).toThrow('El porcentaje debe estar entre 1 y 100');
  });

  it('debe lanzar error si el porcentaje es negativo', () => {
    expect(() => validarDescuento(-10)).toThrow('El porcentaje debe estar entre 1 y 100');
  });

  it('debe lanzar error si el porcentaje es undefined', () => {
    expect(() => validarDescuento(undefined)).toThrow('El porcentaje de descuento es obligatorio');
  });

  it('debe lanzar error si el porcentaje no es un número', () => {
    expect(() => validarDescuento('abc')).toThrow('El porcentaje debe ser un número');
  });
});
