var add = ["if", "functions", "do-while", "switch", "recursion", "classes"];
var rmv = ["for", "while"];
var players = 0;
var join = false;

function teacher_setup() {
	drawList();
}

function teacher_game() {
	players = 10;
	highScores();
}

function student_setup() {

}

function student_game() {
	populateText();
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
	  	li.setAttribute("style", "background-color: #fbb;");
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
	  	li.setAttribute("style", "background-color: #bfb;");
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

function populateText() {
	var code = document.getElementById("code");

	code.innerHTML = "/*Spaceship game\nadd your code here to make your ship stronger\nIf you don't know what a piece of code does\nthen look at the blocks below\n or put your hand up and ask for your teachers help!\nHappy Coding!\n*/\n\nfor(e in enemies) {\n\tif(inRange(e)) {\n\t\tshoot(e);\n\t}\n}\n\nif(health < 20) {\n\theal();\n\trun();\n}";
}