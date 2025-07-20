
//PARA MI PROYECTO DE GRAFICADORA

class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('🟢 Cliente conectado:', socket.id);

            // Figura nueva
            socket.on('new_shape', (shape) => {
                socket.broadcast.emit('new_shape', shape);
            });

            // Actualización de figura
            socket.on('update_shape', ({ id, newAttrs }) => {
                socket.broadcast.emit('update_shape', { id, newAttrs });
            });

            // Eliminación de figura
            socket.on('delete_shape', (id) => {
                socket.broadcast.emit('delete_shape', id);
            });

            // Agrupación
            socket.on('group_shapes', ({ groupShape, groupedIds }) => {
                socket.broadcast.emit('group_shapes', { groupShape, groupedIds });
            });

            // Desagrupación
            socket.on('ungroup_shapes', ({ groupId, children }) => {
                socket.broadcast.emit('ungroup_shapes', { groupId, children });
            });

            socket.on('disconnect', () => {
                console.log('🔴 Cliente desconectado:', socket.id);
            });
        });
    }
}

module.exports = Sockets;

