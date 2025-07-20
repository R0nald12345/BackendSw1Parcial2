const { EntitySchema } = require('typeorm');

const Proyecto = new EntitySchema({
    name: 'Proyecto',
    tableName: 'proyectos',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        nombre: {
            type: 'varchar'
        },
        descripcion: {
            type: 'text',
            nullable: true
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
        usuarios: {
            type: 'one-to-many',
            target: 'UsuarioProyecto',
            inverseSide: 'proyecto'
        }
    }
});

module.exports = { Proyecto };