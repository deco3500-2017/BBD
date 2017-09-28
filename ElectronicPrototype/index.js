var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// Below is so we don't have to write the entire html
// in this file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Listen on the connection event for incoming sockets
// and write to console
io.on('connection', function(socket){
  // On receiving message  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
