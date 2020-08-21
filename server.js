const io = require('socket.io')();

const port = 4321;

io.on('connection', (socket) => {
  // do something
});

console.log('listening on port ' + port + '...');
io.listen(port);
