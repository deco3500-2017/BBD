var add = ["functions", "do-while", "switch", "recursion", "classes"];
var rmv = ["for", "while"];
var players = 0;
var join = false;

function teacher_setup() {
	drawList();
}

function teacher_game() {
	players = 10;
	highScores();

	//play();
}

function student_setup() {

}

function student_game() {

}

function toggle() {
	join = !join;
	var old = players;
	while(join && players < (old + (Math.random() * 10))) {
		addPlayer();
	}
}

function addToRmv(i) {
	s = add[i];
	add.splice(i, 1);
	rmv.push(s);
	drawList();
}

function rmvToAdd(i) {
	s = rmv[i];
	rmv.splice(i, 1);
	add.push(s);
	drawList();
}

function drawList() {
	var ul = document.getElementById("add");
	while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
	for(i in add) {		
	  	var li = document.createElement("li");
	  	li.appendChild(document.createTextNode(" + " + add[i]));
	  	li.setAttribute("onclick", "addToRmv(" + i + ")");
	  	li.setAttribute("style", "background-color: #fdd;");
	  	ul.appendChild(li);
	}

	ul = document.getElementById("rmv");
	while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
	for(i in rmv) {		
	  	var li = document.createElement("li");
	  	li.appendChild(document.createTextNode(" - " + rmv[i]));
	  	li.setAttribute("onclick", "rmvToAdd(" + i + ")");
	  	li.setAttribute("style", "background-color: #dfd;");
	  	ul.appendChild(li);
	}
}

function addPlayer() {
	players += 1;
	var ul = document.getElementById("play-list");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode("Player " + players));
	ul.appendChild(li);
}

function highScores() {
	var ul = document.getElementById("score");
	while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
	for(i = 0; i < players; i++) {		
	  	var li = document.createElement("li");
	  	li.appendChild(document.createTextNode("P" + (i + 1) + ": " + Math.floor(Math.random() * 100 + 100 * (players - i))));
	  	ul.appendChild(li);
	}
}

function selectShip(x) {
	var ships = document.getElementsByClassName("ship");
	for(i = 0; i < ships.length; i++) {
		console.log(i);
		if(i == x) {
			ships[i].setAttribute("class", "ship selected");
		} else {
			ships[i].setAttribute("class", "ship");
		}
	}
}

function play() {
	var can = document.getElementById("game");
	var c = can.getContext("2d");
	var x = 0;
	var y = 0;
	var vx = 0.1;
	var vy = 0.2;
	var f = 0;
	c.fillStyle = "red";
	while(f < 1000) {
		c.clearRect(0, 0, 1280, 720);

		x += vx;
		y += vy;

		c.strokeRect(x,y,20, 20);

		f++;
	}
}