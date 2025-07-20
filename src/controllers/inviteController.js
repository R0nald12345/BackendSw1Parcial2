const { AppDataSource } = require('../database/connection');
const { Usuario } = require('../entities/Usuario');
const { Proyecto } = require('../entities/Proyecto');
const { UsuarioProyecto } = require('../entities/UsuarioProyecto');
const { sendInvitationEmail } = require('../services/emailService');

const inviteUser = async (req, res) => {
    try {
        const { email, proyectoId } = req.body;
        const usuarioId = req.usuario.id;

        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const proyectoRepository = AppDataSource.getRepository(Proyecto);
        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);

        // Verificar que el usuario actual sea administrador del proyecto
        const esAdmin = await usuarioProyectoRepository.findOne({
            where: {
                usuario: { id: usuarioId },
                proyecto: { id: proyectoId },
                rol: 'administrador'
            }
        });

        if (!esAdmin) {
            return res.status(403).json({ message: 'No tienes permisos para invitar usuarios' });
        }

        // Buscar usuario a invitar
        const usuarioInvitado = await usuarioRepository.findOne({ where: { email } });
        if (!usuarioInvitado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que el usuario no esté ya en el proyecto
        const yaEstaEnProyecto = await usuarioProyectoRepository.findOne({
            where: {
                usuario: { id: usuarioInvitado.id },
                proyecto: { id: proyectoId }
            }
        });

        if (yaEstaEnProyecto) {
            return res.status(400).json({ message: 'El usuario ya está en el proyecto' });
        }

        // Obtener información del proyecto
        const proyecto = await proyectoRepository.findOne({ where: { id: proyectoId } });

        // Agregar usuario como invitado
        const nuevaRelacion = usuarioProyectoRepository.create({
            usuario: { id: usuarioInvitado.id },
            proyecto: { id: proyectoId },
            rol: 'invitado'
        });

        await usuarioProyectoRepository.save(nuevaRelacion);

        // Enviar email de invitación (opcional)
        try {
            await sendInvitationEmail(email, proyecto.nombre, req.usuario.nombre);
        } catch (emailError) {
            console.log('Error enviando email:', emailError.message);
            // No fallar la invitación si el email falla
        }

        res.json({
            message: 'Usuario invitado exitosamente',
            usuario: {
                id: usuarioInvitado.id,
                nombre: usuarioInvitado.nombre,
                email: usuarioInvitado.email,
                rol: 'invitado'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const removeUser = async (req, res) => {
    try {
        const { proyectoId, usuarioId: usuarioAEliminarId } = req.params;
        const usuarioActualId = req.usuario.id;

        const usuarioProyectoRepository = AppDataSource.getRepository(UsuarioProyecto);

        // Verificar que el usuario actual sea administrador
        const esAdmin = await usuarioProyectoRepository.findOne({
            where: {
                usuario: { id: usuarioActualId },
                proyecto: { id: parseInt(proyectoId) },
                rol: 'administrador'
            }
        });

        if (!esAdmin) {
            return res.status(403).json({ message: 'No tienes permisos para remover usuarios' });
        }

        // No permitir que el admin se elimine a sí mismo
        if (usuarioActualId == usuarioAEliminarId) {
            return res.status(400).json({ message: 'No puedes eliminarte a ti mismo del proyecto' });
        }

        // Eliminar la relación
        const resultado = await usuarioProyectoRepository.delete({
            usuario: { id: parseInt(usuarioAEliminarId) },
            proyecto: { id: parseInt(proyectoId) }
        });

        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado en el proyecto' });
        }

        res.json({ message: 'Usuario removido del proyecto exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

module.exports = {
    inviteUser,
    removeUser
};