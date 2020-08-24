const session = require('./session.js');

const onlineClients = [];

/* PRIVATE */
function connectClient(sessionId, callback) {
  session.get(sessionId, (clientData) => {
    const onlineClientData = Object.assign({ sessionId: sessionId }, clientData);
    onlineClients.push(onlineClientData);
    callback(onlineClientData);
  });
}

function disconnectClient(sessionId) {
  onlineClients.splice(getOnlineClientIndex(sessionId), 1);
}

function getOnlineClientIndex(sessionId) {
  return onlineClients.findIndex(client => client.sessionId === sessionId);
}

/* EXPORTS */
module.exports.login = function(username, callback) {
  session.create({ username: username }, (sessionId) => {
    connectClient(sessionId, callback);
  });
};

module.exports.logout = function(sessionId, callback) {
  session.delete(sessionId, () => {
    removeOnlineClient(sessionId);
    callback();
  });
};

module.exports.getUsername = function(sessionId) {
  const onlineClient = onlineClients[getOnlineClientIndex(sessionId)]
  return onlineClient ? onlineClient.username : null;
};

module.exports.connect = connectClient;
module.exports.disconnect = disconnectClient;
