const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../database/connection');
const { Usuario } = require('../entities/Usuario');

const register = async (req, res) => {
    try {
        const { email, password, nombre } = req.body;
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Verificar si el usuario ya existe
        const usuarioExistente = await usuarioRepository.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const nuevoUsuario = usuarioRepository.create({
            email,
            password: hashedPassword,
            nombre
        });

        await usuarioRepository.save(nuevoUsuario);

        // Generar token
        const token = jwt.sign(
            { id: nuevoUsuario.id, email: nuevoUsuario.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Buscar usuario
        const usuario = await usuarioRepository.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar password
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const { id, email, nombre } = req.usuario;
        res.json({
            usuario: { id, email, nombre }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

module.exports = { register, login, getProfile };