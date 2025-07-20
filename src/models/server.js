

//PARA MI PROYECTO DE GRAFICADORA

const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const Sockets  = require('./sockets');

class Server {
    constructor() {
        this.app = express();
        this.port = 8080;

        // Servidor HTTP y WebSockets
        this.server = http.createServer(this.app);
        this.io = socketio(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        // Inicializar middlewares y sockets
        this.middlewares();
        this.configurarSockets();
    }

    middlewares() {
        // Servir archivos estáticos desde /public
        this.app.use(express.static(path.resolve(__dirname, '../public')));
    }

    configurarSockets() {
        // Inicializar los sockets
        new Sockets(this.io);
    }

    execute() {
        this.server.listen(this.port, () => {
            console.log(`🟢 Servidor corriendo en http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
