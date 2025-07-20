const { EntitySchema } = require('typeorm');

const UsuarioProyecto = new EntitySchema({
    name: 'UsuarioProyecto',
    tableName: 'usuario_proyectos',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        rol: {
            type: 'enum',
            enum: ['administrador', 'invitado'],
            default: 'invitado'
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        }
    },
    relations: {
        usuario: {
            type: 'many-to-one',
            target: 'Usuario',
            inverseSide: 'proyectos',
            joinColumn: {
                name: 'usuarioId'
            }
        },
        proyecto: {
            type: 'many-to-one',
            target: 'Proyecto',
            inverseSide: 'usuarios',
            joinColumn: {
                name: 'proyectoId'
            }
        }
    }
});

module.exports = { UsuarioProyecto };