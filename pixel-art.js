'use strict';

var COLORS = [
    'white',
    'black',
    'red',
    'orange',
    'pink',
    'brown',
    'green',
    'cornflowerblue',
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
// var floodFillMode = false;
var currentFirstColor = lbmColor.backgroundColor = COLORS[0];
var currentSecondColor = rbmColor.backgroundColor = COLORS[1];


canvas.addEventListener("mousedown", paintListener, false);
canvas.addEventListener("contextmenu", (e) => e.preventDefault(), false);


palette.addEventListener("mousedown", colorListener, false);
palette.addEventListener("contextmenu", (e) => e.preventDefault(), false);

colorPickerValue.addEventListener("mousedown", colorListener, false);
colorPickerValue.addEventListener("contextmenu", (e) => e.preventDefault(), false);


colorPicker.addEventListener("change", (e) => colorPickerValue.style.backgroundColor = e.target.value, false);

sizeCanvas.addEventListener("change", repaintCanvas, false);

checkbox.addEventListener("change", (e) => floodFillMode.turnOn = floodFillMode.turnOn ? false : true, false);

var floodFillMode = new Proxy({ turnOn: false }, {
    get(target, prop) {
        return target[prop];
    },
    set(target, prop, value) {
        canvas.className = canvas.className == "brush" ? "flood-fill" : "brush";
        target[prop] = value;
        return true;
    }
});


function colorListener(e) {
    e = e || window.event;
    var target = e.target;

    var newColor = getComputedStyle(target).backgroundColor;
    if (e.which != 3) {
        lbmColor.backgroundColor = currentFirstColor = newColor;
    } else {
        rbmColor.backgroundColor = currentSecondColor = newColor;
    }

}


var floodFillThrottle = throttle(floodFill, 1000);

function paintListener(e) {
    if (!floodFillMode.turnOn) {

        e.preventDefault();
        fillColor();
        canvas.addEventListener("mouseenter", fillColor, true);
        canvas.addEventListener("mouseup", (e) => canvas.removeEventListener("mouseenter", fillColor, true), false)

    } else { //turned flood fill mode on

        e = e || window.event;
        var target = e.target;
        floodFillThrottle(parseInt(target.getAttribute("x")), parseInt(target.getAttribute("y")), getComputedStyle(target).backgroundColor, whichColor(e));

    }

}


function whichColor(e) {
    var code = e.which || e.keyCode;
    if (code != 3) {
        return currentFirstColor;
    }
    return currentSecondColor;
}


function fillColor(e) {
    e = e || window.event;
    var target = e.target;
    if (target.className.includes("cell")) {
        if (e.which != 3) {
            target.style.backgroundColor = currentFirstColor;
        } else {
            target.style.backgroundColor = currentSecondColor;
        }
        target.classList.add('filled');
    }
}

function isDelete(e) {
    e = e || window.event;
    return e.keyCode != 8 ? e.preventDefault() : true;
};

function repaintCanvas(e) {
    e = e || window.event;
    if (canvas.hasChildNodes()) {
        canvas.innerHTML = '';
    }
    setTimeout(drowCanvas(e.target.value >= 10 ? e.target.value : 10), 4);
}

function drowCanvas(size = 40) {
    sizeCanvas.value = size;
    var containerComputed = getComputedStyle(container);
    var dimention = `${parseInt(containerComputed.width, 10)  / size}px`
    for (var i = 0; i < size; i++) {
        var cell = document.createElement("div");
        cell.className = 'cell';
        cell.style.width = dimention;
        cell.style.height = dimention;
        cell.setAttribute("x", i);
        for (var j = 0; j < size; j++) {
            cell.setAttribute("y", j);
            canvas.appendChild(cell.cloneNode(false));
        }
    }
}

function floodFill(x, y, oldColor, newColor) {

    var target = document.querySelector(`.cell[x='${x}'][y='${y}']`);

    if (!target || getComputedStyle(target).backgroundColor != oldColor || oldColor == newColor){
        return;
    }

    target.style.backgroundColor = newColor;
    target.classList.add('filled');
    floodFill(x - 1, y, oldColor, newColor);
    floodFill(x, y - 1, oldColor, newColor);
    floodFill(x + 1, y, oldColor, newColor);
    floodFill(x, y + 1, oldColor, newColor);
}

function drowPalette(colors = ['blue', 'red', 'black', 'white']) {
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



function throttle(func, ms) {

  var isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { 
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); 

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; 
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}






//start
document.addEventListener("DOMContentLoaded", () => {

    drowCanvas();
    drowPalette(COLORS);

}, false)