const { v4: uuidv4 } = require('uuid');

/* CLASS */
module.exports = class SessionsManager {
  constructor($redis) {
    this.redis = $redis;
  }

  createSession(sessionData, callback) {
    const sessionId = uuidv4();
    this.redis.hset(sessionId, Object.entries(sessionData).flat(), (error, _) => {
      if (error) return console.error(error);
      callback(sessionId);
    });
  }

  getSession(sessionId, callback) {
    this.redis.hgetall(sessionId, (error, hash) => {
      if (error) return console.error(error);
      callback(hash);
    });
  }

  deleteSession(sessionId, callback) {
    this.redis.del(sessionId, (error, count) => {
      if (error) return console.error(error);
      callback();
    });
  }

  getValue(sessionId, key, callback) {
    this.redis.hget(sessionId, key, (error, value) => {
      if (error) return console.error(error);
      callback(value);
    });
  }

  setValue(sessionId, key, value, callback) {
    this.redis.hset(sessionId, key, value, (error, _) => {
      if (error) return console.error(error);
      callback();
    });
  }
}
