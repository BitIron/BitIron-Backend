require('dotenv').config();
const request = require('supertest');
const app = require('../../src/index'); 
const pool = require('../../src/config/db');

describe('API Productos - Tests de Integración', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/productos', () => {
    it('Debe devolver un estado 200 y una lista paginada de productos', async () => {
      const response = await request(app).get('/api/productos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
      
      expect(response.body.meta).toHaveProperty('totalItems');
      expect(response.body.meta).toHaveProperty('currentPage');
      expect(response.body.meta).toHaveProperty('itemsPerPage');
      expect(response.body.meta).toHaveProperty('totalPages');
    });

    it('Debe filtrar productos por categoría', async () => {
      const response = await request(app).get('/api/productos?idCategoria=1');

      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        response.body.data.forEach(producto => {
          expect(producto.IdCategoria).toBe(1);
        });
      }
    });

    it('Debe aplicar límite de paginación correctamente', async () => {
      const limit = 2;
      const response = await request(app).get(`/api/productos?limit=${limit}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(limit);
      expect(parseInt(response.body.meta.itemsPerPage)).toBe(limit);
    });
  });

  describe('GET /api/productos/:id', () => {
    it('Debe devolver un producto válido por su ID (200)', async () => {
      const response = await request(app).get('/api/productos/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('IdProducto', 1);
      expect(response.body).toHaveProperty('Nombre');
      expect(response.body).toHaveProperty('Precio');
    });

    it('Debe devolver error 404 si el producto no existe', async () => {
      const response = await request(app).get('/api/productos/999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
