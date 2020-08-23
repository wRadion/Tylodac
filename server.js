const io = require('socket.io')();
const redis = require('redis')
const redisClient = redis.createClient();

const port = 4321;

var currentId = 0;
var clients = [];

redisClient.on('error', (error) => { console.error(error); });

io.on('connection', (socket) => {
  const client = {
    id: currentId++,
    username: null
  };
  clients.push(client);
  function getClientIndex() { return clients.findIndex(c => c.id === client.id); }

  function log(message) { console.log('[client ' + client.id + '] ' + message); }

  log('connected');

  socket.on('disconnect', () => {
    clients.splice(getClientIndex(), 1);
    log('disconnected')
  });

  socket.on('client_login', (username, res) => {
    clients[getClientIndex()].username = username;
    res(true);
    log('login');
  });

  socket.on('client_check_username', (username, res) => {
    res(clients.findIndex(c => c.username === username) >= 0);
    log('check_username');
  });
});

console.log('listening on port ' + port + '...');
io.listen(port);
