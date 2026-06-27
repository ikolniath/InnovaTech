//Importamos Server de socket.io para agregar WebSockets al servidor Express
const { Server } = require('socket.io');

let io = null;

//Configuramos Socket.IO una sola vez usando el servidor HTTP principal
function configureSocket(server) {
  io = new Server(server);

  //Registro la conexion de un cliente para dejar evidencia del canal en tiempo real
  io.on('connection', (socket) => {
    console.log(`Cliente conectado por WebSocket: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado de WebSocket: ${socket.id}`);
    });
  });

  return io;
}

//Uso esta funcion para emitir eventos desde controladores sin acoplarlos a app.js
function emitPedidoEvent(evento, payload) {
  if (!io) {
    return;
  }

  io.emit(evento, payload);
  io.emit('pedidos:actualizados', payload);
}

//Exportamos la configuracion y el emisor de eventos para reutilizarlos
module.exports = {
  configureSocket,
  emitPedidoEvent
};
