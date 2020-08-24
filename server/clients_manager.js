const session = require('./session.js');

const onlineClients = [];

/* PRIVATE */
function getOnlineClientIndex(sessionId) {
  return onlineClients.findIndex(client => client.sessionId === sessionId);
}

function removeOnlineClient(sessionId) {
  onlineClients.splice(getOnlineClientIndex(sessionId), 1);
}

function connectClient(sessionId, callback) {
  console.log(onlineClients.length);
  if (getOnlineClientIndex(sessionId) >= 0) {
    // Someone already connected with same sessionId
    // TODO: send errror to client?
    return;
  }
  session.get(sessionId, (clientData) => {
    const onlineClientData = Object.assign({ sessionId: sessionId }, clientData);
    onlineClients.push(onlineClientData);
    callback(onlineClientData);
  });
}

function disconnectClient(sessionId) {
  if (getOnlineClientIndex < 0) {
    // Client is not connected
    return;
  }
  removeOnlineClient(sessionId);
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

module.exports.connect = connectClient;
module.exports.disconnect = disconnectClient;
