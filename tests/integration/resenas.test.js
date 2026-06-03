const request = require('supertest');
const app = require('../../src/index'); 

describe('Endpoint POST /api/resenas', () => {
    it('Debe registrar una reseña, devolver estado 201 y un mensaje de éxito', async () => {
        const payload = {
            puntuacion: 5,
            comentario: 'La proteina se disuelve perfectamente, gran calidad.',
            idProducto: 1
        };

        const res = await request(app)
            .post('/api/resenas')
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Reseña guardada correctamente');
    });
});