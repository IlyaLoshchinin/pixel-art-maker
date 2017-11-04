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


var historyPaint = [];

var container = document.querySelector(".container");
var colorPickerValue = document.querySelector(".color-result");
var lbmColor = document.querySelector(".lbm-color").style;
var rbmColor = document.querySelector(".rbm-color").style;


//default size 40x40
var canvasSize = 40;
var currentFirstColor = lbmColor.backgroundColor = COLORS[0];
var currentSecondColor = rbmColor.backgroundColor = COLORS[1];


document.addEventListener("keydown", stepBack, false);

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


function paintListener(e) {
    if (!floodFillMode.turnOn) {

        e.preventDefault();
        fillColor();
        canvas.addEventListener("mouseenter", fillColor, true);
        canvas.addEventListener("mouseup", (e) => canvas.removeEventListener("mouseenter", fillColor, true), false)

    } else { //turned flood fill mode on

        e = e || window.event;
        var target = e.target;
        let prev = historyPaint.length;
        floodFill(parseInt(getX(target)), parseInt(getY(target)), getBGColor(target), whichColor(e));

        // if size of array(historyPaint) did't change => set prev value to the last element of historyPaint otherwise subtraction of curr size and prev value
        historyPaint[historyPaint.length - 1].countOfFloodFill = prev != historyPaint.length ? historyPaint.length - prev : prev;
    }

}

function getBGColor(target) {
    return getComputedStyle(target).backgroundColor;
}

function getX(target) {
    return target.x == 0 || target.x ? target.x : target.getAttribute("x");
}

function getY(target) {
    return target.y == 0 || target.y ? target.y : target.getAttribute("y");
}



function fillColor(e) {
    e = e || window.event;
    var target = e.target;
    let newColor, oldColor;
    if (target.className.includes("cell")) {
        oldColor = getBGColor(target);

        if (e.which != 3) {
            target.style.backgroundColor = newColor = currentFirstColor;
        } else {
            target.style.backgroundColor = newColor = currentSecondColor;
        }

        historyPaint.push({ x: parseInt(getX(target)), y: parseInt(getY(target)), color: newColor, oldColor: oldColor, hashCode: getX(target) + "-" + getY(target) });
        // console.log(historyPaint.length);

        target.classList.add('filled');
    }
}

function repaintCanvas(e) {
    e = e || window.event;
    if (canvas.hasChildNodes()) {
        canvas.innerHTML = '';
    }
    let newCountOfCell = e.target.value;
    setTimeout(drowCanvas(newCountOfCell >= 10 ? newCountOfCell : 10), 4);
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

    if (!target || getComputedStyle(target).backgroundColor != oldColor || oldColor == newColor) {
        return;
    }

    historyPaint.push({ x: x, y: y, color: newColor, oldColor: oldColor, hashCode: x + "-" + y });
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

function cleanCell(target) {
    if (!target) return;

    var cell = document.querySelector(`.cell[x='${getX(target)}'][y='${getY(target)}']`);
    cell.style.backgroundColor = target.oldColor;

    if (!historyPaint.find((el) => el.hashCode == target.hashCode ? true : undefined))
        cell.classList.remove("filled");
}


function stepBack(e) {
    e = e || window.event;
    var code = e.which || e.keyCode;

    //press Ctrl + Z
    if (code == 90 && e.ctrlKey && historyPaint.length != 0) {
        let target = historyPaint.pop();

        if (!target.countOfFloodFill) {
            //simple clean cell
            cleanCell(target);
        } else {
            //clean after flood fill
            let count = target.countOfFloodFill;
            cleanCell(target);
            for (var i = 0; i < count - 1; i++) {
                target = historyPaint.pop();
                cleanCell(target);
            }

        }


    }
}


function whichColor(e) {
    var code = e.which || e.keyCode;
    if (code != 3) {
        return currentFirstColor;
    }
    return currentSecondColor;
}


function isDelete(e) {
    e = e || window.event;
    return e.keyCode != 8 ? e.preventDefault() : true;
};



//start
document.addEventListener("DOMContentLoaded", () => {

    drowCanvas();
    drowPalette(COLORS);

}, false)