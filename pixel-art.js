'use strict';

var COLORS = [
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
	'deepskyblue',
	'deeppink',
	'gold',
	'indigo',
	'greenyellow',
	'fuchsia'
]; //20 colors

//default size 40x40
var canvasSize = 40;
var currentFirstColor = COLORS[0];
var currentSecondColor = COLORS[1];

var canvas = document.getElementById("canvas");
var palette = document.getElementById("palette");
var setting = document.getElementById("setting");

var container = document.querySelector(".container");

canvas.addEventListener("mousedown", paintListener, false)
canvas.addEventListener("contextmenu",  (e) => e.preventDefault(), false)

palette.addEventListener("mousedown", colorListener, false)
palette.addEventListener("contextmenu",  (e) => e.preventDefault(), false)

function colorListener (e) {
		e = e || window.event;
		var target = e.target;
		if(target.className.includes("color")){
			var newColor = target.style['background-color'];
			if(e.which != 3){
				currentFirstColor = newColor;
			}else{
				currentSecondColor = newColor;
			}
		}
}

function paintListener(e){
		e.preventDefault();
		fillColor();
		canvas.addEventListener("mouseenter", fillColor,true);
		canvas.addEventListener("mouseup", (e) => canvas.removeEventListener("mouseenter", fillColor, true), false)
}

function fillColor(e){
		 e = e || window.event;
		var target = e.target ;
		if (target.className.includes("cell")){
			if(e.which != 3){
				target.style.backgroundColor = currentFirstColor;
			}else{
				target.style.backgroundColor = currentSecondColor;
			}
		}	
}


function drowCanvas (size = 40) {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			var cell = document.createElement("div");
			cell.className = `cell-x${i}-y${j}`;
			cell.style.width = `${Math.min(container.clientWidth / size)}px`;
			cell.style.height = cell.style.width;
			canvas.appendChild(cell);
		}
	}
}

function drowPalette(colors = ['blue','red','black','white']){
	console.log(colors.length);
	for (var i = 0; i < colors.length; i++) {
	 var colorDiv = document.createElement("div");
	 colorDiv.className = `color-${colors[i]}`;
	 colorDiv.style.backgroundColor = colors[i];
	 colorDiv.style.width = `${Math.min(container.clientWidth / colors.length) - 0.1}px`;
	 colorDiv.style.height = '40px'; 
	 palette.appendChild(colorDiv);
	}
}
document.addEventListener("DOMContentLoaded", () => {
	
	drowCanvas(canvasSize);
	drowPalette(COLORS);

}, false)



 	