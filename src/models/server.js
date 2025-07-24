

//PARA MI PROYECTO DE GRAFICADORA

const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const Sockets  = require('./sockets');

class Server {
    constructor(appMiddlewares, appRoutes) {
        this.app = express();
        this.port = process.env.PORT || 3000;

        // Servidor HTTP y WebSockets
        this.server = http.createServer(this.app);
        this.io = socketio(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        // Inicializar middlewares y sockets
        this.middlewares(appMiddlewares, appRoutes);
        this.configurarSockets();
    }

    middlewares(appMiddlewares, appRoutes) {
        // Servir archivos estáticos desde /public
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        // Middlewares externos
        if (appMiddlewares) appMiddlewares(this.app);
        // Rutas externas
        if (appRoutes) appRoutes(this.app);
    }

    configurarSockets() {
        new Sockets(this.io);
    }

    execute() {
        this.server.listen(this.port, () => {
            console.log(`🟢 Servidor corriendo en http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
