const io = require('socket.io')();
const port = 4321;
const redis = require('redis').createClient();

/* REDIS */
redis.on('ready', () => console.log('redis is ready'));
redis.on('error', (error) => console.error(error));

/* UTILS */
function getSessionIdCookie(socket) {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) return null; // No cookies
  const match = cookies.match(/sessionId=([^;]+)/);
  if (!match) return null; // No sessionId
  return match[1];
}

/* GLOBAL CONTEXT */
const SessionsManager = require('./server/global/sessions_manager.js');
const ClientsManager = require('./server/global/clients_manager.js');
const RoomsManager = require('./server/global/rooms_manager.js');

$sessionsManager = new SessionsManager(redis);
$roomsManager = new RoomsManager(io);
$clientsManager = new ClientsManager($sessionsManager, $roomsManager);

const $global = {
  sessionsManager: $sessionsManager,
  clientsManager: $clientsManager,
  roomsManager: $roomsManager
};

/* CLIENT CONTEXT */
const connectionEvents = require('./server/client/connection_events.js');
const multiRoomsEvents = require('./server/client/multi/rooms_events.js');

io.on('connection', (socket) => {
  const client = {
    socket,
    sessionId: getSessionIdCookie(socket)
  };
  connectionEvents.registerEvents($global, client);
  multiRoomsEvents.registerEvents($global, client);
});

/* SERVER CONTEXT */
console.log('listening on port ' + port + '...');
io.listen(port);
