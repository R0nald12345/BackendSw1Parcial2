const { DataSource } = require('typeorm');
const { Usuario } = require('../entities/Usuario');
const { Proyecto } = require('../entities/Proyecto');
const { UsuarioProyecto } = require('../entities/UsuarioProyecto');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Solo para desarrollo
    logging: false,
    entities: [Usuario, Proyecto, UsuarioProyecto],
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = { AppDataSource };