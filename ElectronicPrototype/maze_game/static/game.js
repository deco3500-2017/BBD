var socket = io();

var movement = 0;


$(document).keyup(function(e){
    if((e.which == 38))//Up arrow
        //player.y--;
        movement = 1;
    else if((e.which == 40)) // down arrow
        //player.y++;
        movement = 2;
    else if((e.which == 37))
        //splayer.x--;
        movement = 3;
    else if ((e.which == 39))
        //player.x++;
        movement = 4;
    socket.emit('movement', movement);
    movement = 0;
});
    
socket.emit('new player');
