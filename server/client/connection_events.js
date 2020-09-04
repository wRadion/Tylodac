module.exports.registerEvents = function($global, client) {
  function connectClient(clientData) {
    Object.assign(client, clientData);
    console.log('Client connected', client.username);

    /* Event Handlers */
    client.socket.on('client_username', (res) => {
      res(client.username);
      console.log('Client username', client.username);
    });

    client.socket.on('disconnect', () => {
      $global.clientsManager.disconnectClient(client.sessionId);
      console.log('Client disconnected', client.username);
    });

    client.socket.on('client_logout', (res) => {
      $global.clientsManager.logout(client.sessionId, () => res(true));
      console.log('Client logout', client.username);
    });
  }

  if (!client.sessionId) { /* Client (No Login) */
    client.socket.on('client_login', (username, res) => {
      $global.clientsManager.login(username, (clientData) => {
        res(clientData.sessionId);
        console.log('Client login', clientData.username);
        connectClient(clientData);
      });
    });
  } else { /* Client (Login) */
    $global.clientsManager.connectClient(client.sessionId, (clientData) => {
      connectClient(clientData);
    });
  }
};
