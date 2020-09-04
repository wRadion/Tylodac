/* UTILS */
function getOnlineClientIndex(onlineClients, sessionId) { return onlineClients.findIndex(client => client.sessionId === sessionId); }
function removeOnlineClient(onlineClients, sessionId) { onlineClients.splice(getOnlineClientIndex(onlineClients, sessionId), 1); }

/* CLASS */
module.exports = class ClientsManager {
  constructor(sessionsManager, roomsManager) {
    this.sessionsManager = sessionsManager;
    this.roomsManager = roomsManager;
    this.onlineClients = [];
  }

  login(username, callback) {
    this.sessionsManager.createSession({ username: username }, (sessionId) => {
      this.connectClient(sessionId, callback);
    });
  }

  logout(sessionId, callback) {
    this.sessionsManager.deleteSession(sessionId, () => {
      this.disconnectClient(sessionId);
      callback();
    });
  }

  connectClient(sessionId, callback) {
    if (getOnlineClientIndex(this.onlineClients, sessionId) >= 0) {
      // Someone already connected with same sessionId
      // TODO: send errror to client?
      return;
    }
    this.sessionsManager.getSession(sessionId, (clientData) => {
      const onlineClientData = Object.assign({ sessionId: sessionId }, clientData);
      this.onlineClients.push(onlineClientData);
      callback(onlineClientData);
    });
  }

  disconnectClient(sessionId) {
    if (getOnlineClientIndex(this.onlineClients, sessionId) < 0) {
      // Client is not connected
      return;
    }
    this.roomsManager.leaveRoom(sessionId);
    removeOnlineClient(this.onlineClients, sessionId);
  }
}
