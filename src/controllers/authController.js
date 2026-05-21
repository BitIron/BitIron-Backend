const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

const SECRET_KEY = process.env.JWT_SECRET || 'super_secreto_bitiron_123';

const registro = catchAsync(async (req, res, next) => {
    const { nombreCompleto, email, password } = req.body;

    // Verificar si el email ya existe
    const [usuariosExistentes] = await pool.query('SELECT * FROM CLIENTE WHERE Email = ?', [email]);
    if (usuariosExistentes.length > 0) {
        return next(new CustomError('El email ya está en uso.', 409));
    }

    // Hashear la contraseña antes de guardarla
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar usuario con rol 'cliente' por defecto
    const queryInsert = 'INSERT INTO CLIENTE (NombreCompleto, Email, Password_Hash, Rol) VALUES (?, ?, ?, ?)';
    const [resultado] = await pool.query(queryInsert, [nombreCompleto, email, passwordHash, 'cliente']);

    res.status(201).json({
        mensaje: 'Usuario registrado exitosamente.',
        idCliente: resultado.insertId
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Buscar al usuario por su email
    const [usuarios] = await pool.query('SELECT * FROM CLIENTE WHERE Email = ?', [email]);
    if (usuarios.length === 0) {
        return next(new CustomError('Credenciales inválidas.', 401));
    }

    const usuario = usuarios[0];

    // Comparar contraseña plana contra el hash
    const passwordValido = await bcrypt.compare(password, usuario.Password_Hash);
    if (!passwordValido) {
        return next(new CustomError('Credenciales inválidas.', 401));
    }

    // Generar JWT con duración de 24 horas
    const payload = {
        id: usuario.IdCliente,
        rol: usuario.Rol,
        email: usuario.Email
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

    res.status(200).json({
        mensaje: 'Inicio de sesión exitoso.',
        token: token,
        usuario: {
            id: usuario.IdCliente,
            nombre: usuario.NombreCompleto,
            rol: usuario.Rol
        }
    });
});

const perfil = catchAsync(async (req, res, next) => {
    // req.usuario viene inyectado por el middleware verificarToken
    const { id } = req.usuario;

    const [rows] = await pool.query(
        'SELECT IdCliente, NombreCompleto, Email, Rol, ObjetivoFitness FROM CLIENTE WHERE IdCliente = ?',
        [id]
    );

    if (rows.length === 0) {
        return next(new CustomError('Usuario no encontrado.', 404));
    }

    res.status(200).json({ usuario: rows[0] });
});

const updatePerfil = catchAsync(async (req, res, next) => {
    const id = req.usuario.id; // Obtenido del token por el middleware
    const { nombreCompleto, objetivoFitness } = req.body;

    const [result] = await pool.query(
        'UPDATE CLIENTE SET NombreCompleto = ?, ObjetivoFitness = ? WHERE IdCliente = ?',
        [nombreCompleto, objetivoFitness, id]
    );

    if (result.affectedRows === 0) {
        return next(new CustomError('Usuario no encontrado.', 404));
    }

    res.status(200).json({ mensaje: 'Perfil actualizado correctamente.' });
});

module.exports = {
    registro,
    login,
    perfil,
    updatePerfil
};
