var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use('/static', express.static(__dirname + '/static'));
app.use('/images', express.static(__dirname + '/images'));


app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/ss'));


app.get('/student_setup', function(req, res){
  res.sendFile(__dirname + '/student_setup.html');
});

app.get('/teacher_setup', function(req, res){
  res.sendFile(__dirname + '/teacher_setup.html');
});

app.get('/student_game', function(req, res){
  res.sendFile(__dirname + '/student_game.html');
});

app.get('/teacher_game', function(req, res){
  res.sendFile(__dirname + '/teacher_game.html');
});

app.get('/dashboard', function(req, res){
  res.sendFile(__dirname + '/dashboard.html');
});
// Below is so we don't have to write the entire html
// in this file
/*
app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/lessonPlan', function(req, res){
  res.sendFile(__dirname + '/lessonPlan.html');
});
*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/mazeGame.html');
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
var playerCount = 0;

var startX = [0, 0, 9, 9];
var startY = [0, 9, 0, 9];

var counters = {};

function checkWin(x, y){
    return ((x == 4) && (y == 4));
}

// Listen on the connection event for incoming sockets
// and write to console
io.on('connection', function(socket){
    socket.on('new player', function(playerType) {
        if(playerType == "teacher") {
            io.sockets.emit('state', players);
            io.sockets.emit('playerTitle', "teacher");
        } else {
           
            var freeName = true;
            for(var aName in names) {
                console.log("aName: " +aName);
                if(names[aName] == 0) {
                    freeName = false;
                    break;
                }
            }
            
            if(freeName == true) {
                names[socket.id] = 0;
            } else {
                freeName = true;  
                for(var aName in names) {
                    if(names[aName] == 1) {
                        freeName = false;
                        break;
                    }
                }
                
                if(freeName == true) {
                    names[socket.id] = 1;
                }  else {
                    freeName = true;  
                    for(var aName in names) {
                        if(names[aName] == 2) {
                            freeName = false;
                            break;
                        } 
                    } 
                    if(freeName == true) {
                        names[socket.id] = 2;
                    } else {
                        freeName = true;  
                        for(var aName in names) {
                            if(names[aName] == 3) {
                                freeName = false;
                                break;
                            } 
                        } 
                        if(freeName == true) {
                            names[socket.id] = 3;
                        }
                    }
                }    
            }
            
            players[socket.id] = {
                name: names[socket.id], 
                x: startX[names[socket.id]],
                y: startY[names[socket.id]]
            };
            
            
            console.log(names);

            counters[socket.id] = 0;
            
            io.sockets.emit('playerTitle', names[socket.id]);
            io.sockets.emit('state', players);
            io.sockets.emit('counterUpdate', counters[socket.id]);
            playerCount++;
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
            if ((msg == 1) && canMove(player.x, player.y-1)){
                player.y--;
                counters[socket.id]--;

            } else if ((msg == 2) && canMove(player.x, player.y+1)) {
                player.y++;
                counters[socket.id]--;

            } else if ((msg == 3) && canMove(player.x-1, player.y)) {
                player.x--;
                counters[socket.id]--;

            } else if ((msg == 4) && canMove(player.x+1, player.y)) {
                player.x++;
                counters[socket.id]--;
            }
                    
            if(checkWin(player.x, player.y) == true) {
                io.sockets.emit('win', names[socket.id]);
            }
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
        console.log("player disconneted\n\n");
        playerCount--;
        delete players[socket.id];
        delete names[socket.id];
        delete counters[socket.id];
        io.sockets.emit('state', players);
    })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

