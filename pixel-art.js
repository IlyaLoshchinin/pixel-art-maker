'use strict';

var colors = [
	'white',
	'black',
	'red',
	'orange',
	'pink',
	'brown',
	'green',
	'cyan',
	'blue',
	'purple',
	'dimgray',
	'aqua',
	'darkblue',
	'cornsilk',
	'deepslyblue',
	'deeppink',
	'gold',
	'indigo',
	'greenyellow',
	'fuchsia'
]; //20 colors

//default size 50x50
// var canvasColumns = 40;
// var canvasRows = 20;
var currentFirstColor = colors[5];
var currentSecondColor = colors[1];

var canvas = document.getElementById("canvas");

canvas.addEventListener("mousedown", paintListener, false)
canvas.addEventListener("contextmenu",  (e) => e.preventDefault(), false)

function paintListener(e){
		e.preventDefault();
		fillColor();
		canvas.addEventListener("mouseenter", fillColor,true);
		canvas.addEventListener("mouseup", (e) => canvas.removeEventListener("mouseenter", fillColor, true), false)
}

function fillColor(e){
		 e = e || window.event;
		var target = e.target ;
		console.log(e.which);
		if (target.className == "cell"){
			if(e.which != 3){
				target.style.backgroundColor = currentFirstColor;
			}else{
				target.style.backgroundColor = currentSecondColor;
			}
		}	
}


function drowCanvas (rows = 10,cols = 50) {
	var container = document.querySelector(".container");
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var cell = document.createElement("div");
			cell.className = "cell";
			cell.style.width = Math.round(container.clientWidth / cols) + "px";
			cell.style.height = cell.style.width;
			canvas.appendChild(cell);
		}
	}
}
document.addEventListener("DOMContentLoaded", () => {
	drowCanvas();


}, false)



 	