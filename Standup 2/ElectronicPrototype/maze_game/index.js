var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use('/static', express.static(__dirname + '/static'));

// Below is so we don't have to write the entire html
// in this file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var maze = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [ 0, 0, 0, 1, 0, 1, 1, 0, 1, 0],
    [ 1, 1, 1, 1,-1, 1, 1, 0, 1, 0],
    [ 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [ 1, 0, 0, 0, 0, 1, 1, 0, 1, 0],
    [ 1, 0, 1, 0, 0, 1, 1, 0, 0, 0],
    [ 1, 1, 1, 1, 0, 1, 0, 1, 1, 0],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
];
//Check to see if the new space is inside the maze and not a wall
function canMove(x, y){
    return (y>=0) && (y<maze.length) && (x >= 0) && (x < maze[y].length) && (maze[y][x] != 1);
}


var players = {};
var names = {};
var playerCount = -1;
var startX = [0, 0, 9, 9];
var startY = [0, 9, 0, 9];

var counters = {};

function checkWin(x, y){
    return ((x == 4) && (y == 4));
}

// Listen on the connection event for incoming sockets
// and write to console
io.on('connection', function(socket){
    socket.on('new player', function() {
        if(playerCount == -1) {
            io.sockets.emit('state', players);
            io.sockets.emit('playerTitle', 'x');
            playerCount++;
        } else {
            players[socket.id] = {
                x: startX[playerCount],
                y: startY[playerCount]
            };
            
            names[socket.id] = playerCount;
            counters[socket.id] = 0;
            
            playerCount++;
            io.sockets.emit('state', players);
            io.sockets.emit('playerTitle', names[socket.id]);
            io.sockets.emit('counterUpdate', counters[socket.id]);
        }

    });
    
    socket.on("addCounter", function(amount) {
        counters[socket.id] += amount;
        io.sockets.emit('counterUpdate', counters[socket.id]);

    });
    // On receiving message  
    socket.on('movement', function(msg){
        var player = players[socket.id] || {};
        
        if(counters[socket.id] > 0) {
            if ((msg == 1) && canMove(player.x, player.y-1))
                player.y--;
            else if ((msg == 2) && canMove(player.x, player.y+1))
                player.y++;
            else if ((msg == 3) && canMove(player.x-1, player.y))
                player.x--;
            else if ((msg == 4) && canMove(player.x+1, player.y))
                player.x++;
                    
            if(checkWin(player.x, player.y) == true) {
                io.sockets.emit('win', names[socket.id]);
            }
            
            counters[socket.id]--;
        } 
        
        io.sockets.emit('state', players);
        io.sockets.emit('counterUpdate', counters[socket.id]);

    });
    
    /*
    socket.on('clearGame', function(){
       delete players[socket.id];
       io.sockets.emit('state', players);
       playerCount--;
    });
    */
    socket.on('disconnect', function() {
        delete players[socket.id];
        io.sockets.emit('state', players);
    })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

