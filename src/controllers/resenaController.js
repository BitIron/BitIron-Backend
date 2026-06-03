const db = require('../config/db'); 

const crearResena = async (req, res) => {
    const { puntuacion, comentario, idProducto } = req.body;

    // Validación
    if (!puntuacion || puntuacion < 1 || puntuacion > 5 || !idProducto) {
        return res.status(400).json({ error: 'Datos de reseña inválidos o incompletos.' });
    }

    // Advertencia en el panel de control (Terminal)
    console.warn(`[NUEVA VALORACIÓN] Se ha recibido una reseña para el producto ${idProducto} con nota ${puntuacion}`);

    try {
        const [result] = await db.query(
            'INSERT INTO RESEÑAS (Puntuacion, Comentario, IdProducto) VALUES (?, ?, ?)',
            [puntuacion, comentario, idProducto]
        );
       
        res.status(201).json({ message: 'Reseña guardada correctamente', idResena: result.insertId });
  
    } catch (error) {
        console.error('Error interno:', error);
        res.status(500).json({ error: 'Fallo al guardar la reseña en la base de datos' });
    }
};

module.exports = { crearResena };