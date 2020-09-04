module.exports.registerEvents = function($global, client) {

  client.socket.on('client_lobby_join', () => {
    $global.roomsManager.joinLobby(client);
  });

  client.socket.on('client_lobby_leave', () => {
    $global.roomsManager.leaveLobby(client.sessionId);
  });

  client.socket.on('client_multi_rooms_create', (params, res) => {
    $global.roomsManager.createRoom(client, params, (roomId) => {
      res(roomId);
    });
  });
}
