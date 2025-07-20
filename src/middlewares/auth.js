const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../database/connection');
const { Usuario } = require('../entities/Usuario');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const usuario = await usuarioRepository.findOne({ where: { id: decoded.id } });

        if (!usuario) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = { auth };