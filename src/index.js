require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const { AppDataSource } = require('./database/connection');

// Importar rutas
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const inviteRoutes = require('./routes/invites');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invites', inviteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API Figma Clone funcionando!' });
});

// Inicializar conexión a BD y servidor
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Conexión a base de datos establecida');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
    }
};

const Server = require('./models/Server');
const server = new Server();
server.execute();

startServer();