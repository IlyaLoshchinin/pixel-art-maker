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

var container = document.querySelector(".container");
var colorPickerValue = document.querySelector(".color-result");
var lbmColor = document.querySelector(".lbm-color").style;
var rbmColor = document.querySelector(".rbm-color").style;


//default size 40x40
var canvasSize = 40;
var currentFirstColor = lbmColor.backgroundColor = COLORS[0];
var currentSecondColor = rbmColor.backgroundColor = COLORS[1];


canvas.addEventListener("mousedown", paintListener, false);
canvas.addEventListener("contextmenu",  (e) => e.preventDefault(), false);


palette.addEventListener("mousedown", colorListener, false);
palette.addEventListener("contextmenu",  (e) => e.preventDefault(), false);

colorPickerValue.addEventListener("mousedown", colorListener, false);
colorPickerValue.addEventListener("contextmenu",  (e) => e.preventDefault(), false);


colorPicker.addEventListener("change", (e) => colorPickerValue.style.backgroundColor = e.target.value, false);

sizeCanvas.addEventListener("change",  repaintCanvas, false);

function colorListener (e) {
		e = e || window.event;
		var target = e.target;
		
			var newColor = getComputedStyle(target, null);
			if(e.which != 3){
				currentFirstColor = newColor.backgroundColor;
				lbmColor.backgroundColor = currentFirstColor;
			}else{
				currentSecondColor = newColor.backgroundColor;
				rbmColor.backgroundColor = currentSecondColor;
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
			target.className += ' filled';
		}	
}

function isDelete(e) {
	e = e || window.event;
	return e.keyCode != 8 ? e.preventDefault() : true;
};

function repaintCanvas(e) {
	e = e || window.event;
	if(canvas.hasChildNodes()){
		canvas.innerHTML = '';
	}
	setTimeout(drowCanvas(e.target.value >= 10 ? e.target.value : 10 ), 4);
}

function drowCanvas (size = 40) {
	sizeCanvas.value = size;
	var containerComputed = getComputedStyle(container);
	var dimention = `${parseInt(containerComputed.width, 10)  / size}px`
	for (var i = 0; i < size; i++) {
		var cell = document.createElement("div");
		cell.className = `cell`;
		cell.style.width = dimention;
		cell.style.height = dimention;
		cell.setAttribute("x", i);
		for (var j = 0; j < size; j++) {
			cell.setAttribute("y", j);
			canvas.appendChild(cell.cloneNode(false));
		}
	}
}

function flood_fill (e,x,y,oldColor,newColor) {
	e = e || window.e;
	var target = e.target;



	if(target.backgroundColor != oldColor) 
		break;

	target.backgroundColor = newColor;
	flood_fill(x - 1,y,oldColor,newColor);
	flood_fill(x + 1,y,oldColor,newColor);
	flood_fill(x,y - 1,oldColor,newColor);
	flood_fill(x,y + 1,oldColor,newColor);
}

function drowPalette(colors = ['blue','red','black','white']){
	console.log(colors.length);
	for (var i = 0; i < colors.length; i++) {
	 var colorDiv = document.createElement("div");
	 colorDiv.className = `color-${i+1}`;
	 colorDiv.style.backgroundColor = colors[i];
	 colorDiv.style.width = `${container.clientWidth  / colors.length }px`;
	 colorDiv.style.height = '40px'; 
	 palette.appendChild(colorDiv);
	}
}

//start
document.addEventListener("DOMContentLoaded", () => {
	
	drowCanvas();
	drowPalette(COLORS);

}, false)



 	