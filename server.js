const io = require('socket.io')();
const clientsManager = require('./server/clients_manager.js');

const port = 4321;

io.on('connection', (socket) => {
  var client = null;

  socket.on('client_login', (username, res) => {
    clientsManager.login(username, (onlineClientData) => {
      res((client = onlineClientData).sessionId);
      console.log('Client login (+connected)', username);
    });
  });

  socket.on('client_connect', (sessionId) => {
    clientsManager.connect(sessionId, (onlineClientData) => {
      client = onlineClientData;
      console.log('Client connected', client.username);
    });
  });

  socket.on('disconnect', () => {
    clientsManager.disconnect(client.sessionId);
    console.log('Client disconnected', client.username);
  });

  socket.on('client_logout', (sessionId, res) => {
    clientsManager.logout(sessionId, () => res(true));
    console.log('Client logout', client.username);
  });
});

console.log('listening on port ' + port + '...');
io.listen(port);
