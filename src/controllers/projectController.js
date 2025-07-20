const { AppDataSource } = require('../database/connection');
const { Proyecto } = require('../entities/Proyecto');
const { UsuarioProyecto } = require('../entities/UsuarioProyecto');
const { Usuario } = require('../entities/Usuario');

const createProject = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const usuarioId = req.usuario.id;

        const proyectoRepository = AppDataSource.getRepository(Proyecto);
        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);

        // Crear proyecto
        const nuevoProyecto = proyectoRepository.create({
            nombre,
            descripcion
        });

        await proyectoRepository.save(nuevoProyecto);

        // Asignar usuario como administrador
        const usuarioProyecto = usuarioProyectoRepository.create({
            usuario: { id: usuarioId },
            proyecto: { id: nuevoProyecto.id },
            rol: 'administrador'
        });

        await usuarioProyectoRepository.save(usuarioProyecto);

        res.status(201).json({
            message: 'Proyecto creado exitosamente',
            proyecto: nuevoProyecto
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const getMyProjects = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);

        const proyectos = await usuarioProyectoRepository.find({
            where: { usuario: { id: usuarioId } },
            relations: ['proyecto'],
            order: { createdAt: 'DESC' }
        });

        const proyectosAgrupados = {
            administrador: [],
            invitado: []
        };

        proyectos.forEach(up => {
            proyectosAgrupados[up.rol].push({
                id: up.proyecto.id,
                nombre: up.proyecto.nombre,
                descripcion: up.proyecto.descripcion,
                rol: up.rol,
                fechaUnion: up.createdAt
            });
        });

        res.json({
            proyectos: proyectosAgrupados
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);

        // Verificar acceso al proyecto
        const acceso = await usuarioProyectoRepository.findOne({
            where: {
                usuario: { id: usuarioId },
                proyecto: { id: parseInt(id) }
            },
            relations: ['proyecto', 'usuario']
        });

        if (!acceso) {
            return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
        }

        // Obtener todos los colaboradores del proyecto
        const colaboradores = await usuarioProyectoRepository.find({
            where: { proyecto: { id: parseInt(id) } },
            relations: ['usuario']
        });

        res.json({
            proyecto: {
                id: acceso.proyecto.id,
                nombre: acceso.proyecto.nombre,
                descripcion: acceso.proyecto.descripcion,
                miRol: acceso.rol
            },
            colaboradores: colaboradores.map(c => ({
                id: c.usuario.id,
                nombre: c.usuario.nombre,
                email: c.usuario.email,
                rol: c.rol
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const usuarioId = req.usuario.id;

        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);
        const proyectoRepository = AppDataSource.getRepository(Proyecto);

        // Verificar que el usuario sea administrador del proyecto
        const acceso = await usuarioProyectoRepository.findOne({
            where: {
                usuario: { id: usuarioId },
                proyecto: { id: parseInt(id) },
                rol: 'administrador'
            }
        });

        if (!acceso) {
            return res.status(403).json({ message: 'No tienes permisos para modificar este proyecto' });
        }

        // Actualizar proyecto
        await proyectoRepository.update(parseInt(id), { nombre, descripcion });

        res.json({ message: 'Proyecto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);
        const proyectoRepository = AppDataSource.getRepository(Proyecto);

        // Verificar que el usuario sea administrador del proyecto
        const acceso = await usuarioProyectoRepository.findOne({
            where: {
                usuario: { id: usuarioId },
                proyecto: { id: parseInt(id) },
                rol: 'administrador'
            }
        });

        if (!acceso) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar este proyecto' });
        }

        // Eliminar todas las relaciones usuario-proyecto
        await usuarioProyectoRepository.delete({ proyecto: { id: parseInt(id) } });

        // Eliminar proyecto
        await proyectoRepository.delete(parseInt(id));

        res.json({ message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

module.exports = {
    createProject,
    getMyProjects,
    getProjectDetails,
    updateProject,
    deleteProject
};