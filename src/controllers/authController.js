const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'super_secreto_bitiron_123';

const registro = async (req, res) => {
    try {
        const { nombreCompleto, email, password } = req.body;

        // Verificar si el email ya existe
        const [usuariosExistentes] = await pool.query('SELECT * FROM CLIENTE WHERE Email = ?', [email]);
        if (usuariosExistentes.length > 0) {
            return res.status(409).json({ error: 'El email ya está en uso.' });
        }

        // Hashear la contraseña antes de guardarla
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insertar usuario con rol 'cliente' por defecto
        const queryInsert = 'INSERT INTO CLIENTE (NombreCompleto, Email, Password_Hash, Rol) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.query(queryInsert, [nombreCompleto, email, passwordHash, 'cliente']);

        return res.status(201).json({
            mensaje: 'Usuario registrado exitosamente.',
            idCliente: resultado.insertId
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por su email
        const [usuarios] = await pool.query('SELECT * FROM CLIENTE WHERE Email = ?', [email]);
        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const usuario = usuarios[0];

        // Comparar contraseña plana contra el hash
        const passwordValido = await bcrypt.compare(password, usuario.Password_Hash);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar JWT con duración de 24 horas
        const payload = {
            id: usuario.IdCliente,
            rol: usuario.Rol,
            email: usuario.Email
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso.',
            token: token,
            usuario: {
                id: usuario.IdCliente,
                nombre: usuario.NombreCompleto,
                rol: usuario.Rol
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    registro,
    login
};
