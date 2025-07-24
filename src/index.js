require('dotenv').config();
require('reflect-metadata');
const { AppDataSource } = require('./database/connection');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const inviteRoutes = require('./routes/invites.routes');
const geminiRoutes = require('./routes/gemini.routes');

const cors = require('cors');
const express = require('express');

const appMiddlewares = (app) => {
    app.use(cors());
    app.use(express.json());
};

const appRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/invites', inviteRoutes);
    app.use('/api/gemini', geminiRoutes);
    app.get('/', (req, res) => {
        res.json({ message: 'API Figma Clone funcionando!' });
    });
};

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Conexión a base de datos establecida');
        const Server = require('./models/server');
        const server = new Server(appMiddlewares, appRoutes);
        server.execute();
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
    }
};

startServer();