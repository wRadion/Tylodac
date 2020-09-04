const crypto = require('crypto');

class Room {
  constructor(params) {
    this.id = params.id;
    this.creator = params.creator;
    this.language = params.lang;
    this.mode = params.mode;
    switch (this.mode) {
      case 'words': this.wordCount = params.wordCount; break;
      case 'time': this.time = params.time; break;
    }
    this.multiMode = params.multiMode;
    switch (this.multiMode) {
      case 'rounds': this.roundCount = params.roundCount; break;
      case 'timeAttack': this.timeAttack = params.timeAttack; break;
    }
    this.publicRoom = params.publicRoom;
    this.maxPlayerCount = params.maxPlayerCount;
    this.players = [];
  }

  contains(sessionId) {
    return this.players.findIndex(p => p.sessionId === sessionId) > -1;
  }

  join(client) {
    client.socket.join(this.id);
    this.players.push(client);
  }

  leave(sessionId) {
    const clientIndex = this.players.findIndex(p => p.sessionId === sessionId)
    this.players[clientIndex].socket.leave(this.id);
    this.players.splice(clientIndex, 1);
    return this.players.length === 0;
  }

  toJson() {
    return {
      id: this.id,
      creator: this.creator,
      lang: this.language,
      players: `${this.players.length}/${this.maxPlayerCount}`
    };
  }
}

module.exports = class RoomsManager {
  constructor(io) {
    this.io = io;
    this.rooms = [];
    this.lobby = [];
  }

  joinLobby(client) {
    this.lobby.push(client);
    client.socket.join('lobby');
    console.log('Client joined lobby', client.username);
    this.notifyUpdateRoomList(client.socket);
  }

  leaveLobby(sessionId) {
    const clientIndex = this.lobby.findIndex(c => c.sessionId === sessionId);
    if (clientIndex < 0) return;
    const client = this.lobby[clientIndex];
    console.log('Client left lobby', client.username);
    client.leave('lobby');
    this.lobby.splice(clientIndex, 1);
  }

  notifyUpdateRoomList(socket = null) {
    if (this.lobby.length === 0) return;
    if (socket === null) socket = this.io.to('lobby');
    socket.emit('server_multi_rooms_list_update', this.rooms.map(r => r.toJson()));
  }

  createRoom(client, params, callback) {
    const roomId = crypto.randomBytes(4).toString('hex');
    const room = new Room(Object.assign(params, { id: roomId, creator: client.username, players: 'TODO' }));
    room.join(client);
    this.rooms.push(room);
    console.log('Room created', client.username, roomId);
    callback(roomId);
  }

  joinRoom(client, roomId) {
    const room = this.rooms.find(r => r.id === roomId);
    room.join(client);
    console.log('Client joined room', client.username, roomId);
  }

  leaveRoom(sessionId) {
    const roomIndex = this.rooms.findIndex(r => r.contains(sessionId));
    if (roomIndex < 0) return;
    const room = this.rooms[roomIndex];
    if (room.leave(sessionId)) {
      this.rooms.splice(roomIndex, 1);
      this.notifyUpdateRoomList();
    }
    console.log('Client left room', 'TODO', room.id);
  }
}
