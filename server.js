const io = require('socket.io')();

const port = 4321;

var currentId = 0;
var clients = [];

function isUsernameTaken(username) {
  return clients.findIndex(c => c.username === username) >= 0;
}

io.on('connection', (socket) => {
  const index = clients.length;
  const client = {
    id: currentId++,
    username: null
  }
  clients.push(client);
  function log(message) { console.log('[client ' + client.id + '] ' + message); }

  log('connected');

  socket.on('disconnect', () => {
    log('disconnected')
  });

  socket.on('client_login', (username) => {
    clients[index].username = username;
    socket.emit('server_login_response', true);
    log('login');
  });

  socket.on('client_check_username', (username) => {
    socket.emit('server_check_username_response', isUsernameTaken(username));
    log('check_username');
  });

});

console.log('listening on port ' + port + '...');
io.listen(port);
