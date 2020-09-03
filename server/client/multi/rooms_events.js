module.exports.registerEvents = function($store, socket, store) {
  socket.on('client_multi_rooms_create', (params) => {
    console.log('Room created', params);
  });
}
