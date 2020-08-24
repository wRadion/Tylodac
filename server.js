const io = require('socket.io')();
const clientsManager = require('./server/clients_manager.js');

const port = 4321;

function getSessionIdCookie(socket) {
  const cookies = socket.handshake.headers.cookie;
  // No cookies
  if (!cookies) return null;

  const match = cookies.match(/sessionId=([^;]+)/);
  // No sessionId
  if (!match) return null;

  return match[1];
}

io.on('connection', (socket) => {
  const sessionId = getSessionIdCookie(socket);
  var client = null;

  function connectClient(clientData) {
    client = clientData;
    socket.emit('server_connect', client.username);
    console.log('Client connected', client.username);

    /* Event Handlers */
    socket.on('disconnect', () => {
      clientsManager.disconnect(client.sessionId);
      console.log('Client disconnected', client.username);
    });

    socket.on('client_logout', (res) => {
      clientsManager.logout(client.sessionId, () => res(true));
      console.log('Client logout', client.username);
    });
  }

  if (!sessionId) {
    /* Client (No Login) */
    socket.on('client_login', (username, res) => {
      console.log('A client tries to login...');
      clientsManager.login(username, (clientData) => {
        res(clientData.sessionId);
        console.log('Client login', clientData.username);
        connectClient(clientData);
      });
    });
  } else {
    /* Client (Login) */
    clientsManager.connect(sessionId, (clientData) => {
      connectClient(clientData);
    });
  }
});

console.log('listening on port ' + port + '...');
io.listen(port);
