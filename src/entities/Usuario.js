const { EntitySchema } = require('typeorm');

const Usuario = new EntitySchema({
    name: 'Usuario',
    tableName: 'usuarios',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        email: {
            type: 'varchar',
            unique: true
        },
        password: {
            type: 'varchar'
        },
        nombre: {
            type: 'varchar'
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
        updatedAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
        }
    },
    relations: {
        proyectos: {
            type: 'one-to-many',
            target: 'UsuarioProyecto',
            inverseSide: 'usuario'
        }
    }
});

module.exports = { Usuario };