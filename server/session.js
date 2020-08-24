const { v4: uuidv4 } = require('uuid');
const redis = require('redis').createClient();

redis.on('ready', () => console.log('redis is ready'));
redis.on('error', (error) => console.error(error));

/* EXPORTS */
module.exports.create = function(data, callback) {
  const sessionId = uuidv4();
  redis.hset(sessionId, Object.entries(data).flat(), (error, _) => {
    if (error) return console.error(error);
    callback(sessionId);
  });
};

module.exports.get = function(sessionId, callback) {
  redis.hgetall(sessionId, (error, hash) => {
    if (error) return console.error(error);
    callback(hash);
  });
};

module.exports.delete = function(sessionId, callback = () => {}) {
  redis.del(sessionId, (error, count) => {
    if (error) return console.error(error);
    callback();
  });
};

module.exports.getValue = function(sessionId, key, callback) {
  redis.hget(sessionId, key, (error, value) => {
    if (error) return console.error(error);
    callback(value);
  });
};

module.exports.setValue = function(sessionId, key, value, callback = () => {}) {
  redis.hset(sessionId, key, value, (error, _) => {
    if (error) return console.error(error);
    callback();
  });
};
