module.exports.registerEvents = function($store, socket, store) {
  function connectClient(clientData) {
    Object.assign(store, clientData);
    console.log('Client connected', store.username);

    /* Event Handlers */
    socket.on('client_username', (res) => {
      res(store.username);
      console.log('Client username', store.username);
    });

    socket.on('disconnect', () => {
      $store.clientsManager.disconnectClient(store.sessionId);
      console.log('Client disconnected', store.username);
    });

    socket.on('client_logout', (res) => {
      $store.clientsManager.logout(store.sessionId, () => res(true));
      console.log('Client logout', store.username);
    });
  }

  if (!store.sessionId) { /* Client (No Login) */
    socket.on('client_login', (username, res) => {
      $store.clientsManager.login(username, (clientData) => {
        res(clientData.sessionId);
        console.log('Client login', clientData.username);
        connectClient(clientData);
      });
    });
  } else { /* Client (Login) */
    $store.clientsManager.connectClient(store.sessionId, (clientData) => {
      connectClient(clientData);
    });
  }
};
