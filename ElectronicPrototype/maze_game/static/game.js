var socket = io();

var movement = 0;


$(document).on("click", "#up", function(){
    movement = 1;
    socket.emit('movement', movement);
    movement = 0;
});

$(document).on("click", "#down", function(){
    movement = 2;
    socket.emit('movement', movement);
    movement = 0;
});


$(document).on("click", "#left", function(){
    movement = 3;
    socket.emit('movement', movement);
    movement = 0;
});


$(document).on("click", "#right", function(){
    movement = 4;
    socket.emit('movement', movement);
    movement = 0;
});
