/* eslint-disable require-jsdoc */
'use strict';

let COLORS = [
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
  'fuchsia',
]; // 20 colors

const ls = localStorage;
const blankColor = '#cccccc';

let historyPaint = [];

document.addEventListener('keydown', stepBack, false);

const canvas = document.getElementById('canvas');
const palette = document.getElementById('palette');
const sizeCanvas = document.getElementById('sizeCanvas');

canvas.addEventListener('mousedown', paintListener, false);
canvas.addEventListener('contextmenu', (e) => e.preventDefault(), false);
sizeCanvas.addEventListener('change', repaintCanvas, false);
sizeCanvas.addEventListener('keydown', isDelete, false);

palette.addEventListener('mousedown', colorListener, false);
palette.addEventListener('contextmenu', (e) => e.preventDefault(), false);

const container = document.querySelector('.container');

let lbmColor = document.querySelector('.lbm-color').style;
let rbmColor = document.querySelector('.rbm-color').style;

let currentFirstColor = lbmColor.backgroundColor = COLORS[0];
let currentSecondColor = rbmColor.backgroundColor = COLORS[1];

const colorPickerValue = document.querySelector('.color-result');
const colorPicker = document.getElementById('colorPicker');

colorPickerValue.addEventListener('mousedown', colorListener, false);
colorPickerValue.addEventListener(
  'contextmenu', (e) => e.preventDefault(), false
);

colorPicker.addEventListener('change',
       (e) => colorPickerValue.style.backgroundColor = e.target.value, false);

const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change',
         (e) => floodFillMode.turnOn = !floodFillMode.turnOn, false);

const confirmationMessage =
  'Do you really want to leave without saving your drawing locally?';

window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  if (!ls.getItem(keyDrawing)) {
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
});

const clearCanvasButt = document.getElementById('clearCanvas');
clearCanvasButt.addEventListener('click', clearCanvas);

const keyDrawing = 'drawing';
const keySizeCanvas = 'sizeCanvas';
const saveLocallyButton = document.getElementById('saveLocal');
saveLocallyButton.addEventListener('click', saveToLocalStorage);

function saveToLocalStorage() {
  if (historyPaint.length === 0) return false;
  ls.setItem(keyDrawing, getDrawing(historyPaint));
  ls.setItem(keySizeCanvas, sizeCanvas.value);
  alert('Done! You\'ve saved a drawing!');
}

function loadDrawingFromLS() {
  return JSON.parse(ls.getItem(keyDrawing));
}

function simpleFillCell(target, fillColor) {
  if (!target && !fillColor) return false;
  target.style.backgroundColor = fillColor;
  target.classList.add('filled');
}


function loadCanvas() {
  let value = ls.getItem(keyDrawing);
  if (ls.hasOwnProperty(keyDrawing) && value !== undefined) {
    historyPaint = loadDrawingFromLS();
  } else {
    return false;
  }
  let dataOfDrawing = loadDrawingFromLS();
  if (!dataOfDrawing || dataOfDrawing.length === 0) return false;
  dataOfDrawing.forEach((el) => {
    let cell = document.querySelector(
      `.cell[x='${getX(el)}'][y='${getY(el)}']`
    );
    simpleFillCell(cell, el.color);
  });
}

/**
 * @param {Array} historyPaint
 * @return {Array}
 */
function getDrawing(historyPaint) {
  let length = historyPaint.length;
  let totalCellOfCanvas = Math.pow(sizeCanvas.value, 2);
  if (length === 0) return false;
  if (length <= totalCellOfCanvas) return JSON.stringify(historyPaint);
  let tmpMap = new Map();
  historyPaint.forEach((el) => {
    el.oldColor = blankColor;
    tmpMap.set(el.hashCode, el);
  });
  let uniqueHistoryPaint = [...tmpMap.values()];
  return JSON.stringify(uniqueHistoryPaint);
}


const floodFillMode = new Proxy({turnOn: false}, {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    canvas.className =
      (canvas.className === 'brush') ? 'flood-fill' : 'brush';
    target[prop] = value;
    return true;
  },
});


function colorListener(e) {
  e = e || window.event;
  let target = e.target;

  let newColor = getBGColor(target);
  if (e.which !== 3) {
    lbmColor.backgroundColor = currentFirstColor = newColor;
  } else {
    rbmColor.backgroundColor = currentSecondColor = newColor;
  }
}


function paintListener(e) {
  if (!floodFillMode.turnOn) {
    e.preventDefault();
    fillColor();
    canvas.addEventListener('mouseenter', fillColor, true);
    canvas.addEventListener('mouseup', (e) =>
           canvas.removeEventListener('mouseenter', fillColor, true)
      , false);
  } else { // turned flood fill mode on
    e = e || window.event;
    let target = e.target;
    let prev = historyPaint.length;
    floodFill(
      parseInt(getX(target)),
      parseInt(getY(target)),
      getBGColor(target),
      whichColor(e)
    );

    /** Add special value for correct 'step back' feature
     * when we used the flood fill method.
     * ---
     * if size of array(historyPaint) did't change =>
     * set previous value to the last element of historyPaint otherwise
     * subtraction of curr size and prev value
     */
    historyPaint[historyPaint.length - 1].countOfFloodFill =
      prev !== historyPaint.length ? historyPaint.length - prev : prev;
  }
}

function getBGColor(target) {
  return getComputedStyle(target).backgroundColor;
}

function getX(target) {
  return target.x === 0 || target.x ? target.x : target.getAttribute('x');
}

function getY(target) {
  return target.y === 0 || target.y ? target.y : target.getAttribute('y');
}

function fillColor(e) {
  e = e || window.event;
  let target = e.target;
  let newColor;
  let oldColor;
  if (target.className.includes('cell')) {
    oldColor = getBGColor(target);

    if (e.which !== 3) {
      target.style.backgroundColor = newColor = currentFirstColor;
    } else {
      target.style.backgroundColor = newColor = currentSecondColor;
    }

    historyPaint.push({
                        x: parseInt(getX(target)),
                        y: parseInt(getY(target)),
                        color: newColor,
                        oldColor: oldColor,
                        hashCode: getX(target) + '-' + getY(target),
                      });
    // console.log(historyPaint.length);

    target.classList.add('filled');
  }
}


function repaintCanvas(e, size) {
  e = e || window.event;
  let newCountOfCell = !size ? e.target.value : size;
  if (canvas.hasChildNodes()) {
    canvas.innerHTML = '';
  }
  ls.clear();
  historyPaint = [];
  setTimeout(drawCanvas(newCountOfCell >= 10 ? newCountOfCell : 10), 4);
}


function drawCanvas(size) {
  sizeCanvas.value = size;
  let containerComputed = getComputedStyle(container);
  let dimension = `${parseInt(containerComputed.width, 10) / size}px`;
  for (let i = 0; i < size; i++) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.width = dimension;
    cell.style.height = dimension;
    cell.setAttribute('x', i);
    for (let j = 0; j < size; j++) {
      cell.setAttribute('y', j);
      canvas.appendChild(cell.cloneNode(false));
    }
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {Element} oldColor
 * @param {Element} newColor
 **/
function floodFill(x, y, oldColor, newColor) {
  let target = document.querySelector(`.cell[x='${x}'][y='${y}']`);

  if (!target || getBGColor(target) !== oldColor || oldColor === newColor) {
    return;
  }

  historyPaint.push(
    {
      x: x, y: y,
      color: newColor,
      oldColor: oldColor,
      hashCode: x + '-' + y,
    }
  );
  target.style.backgroundColor = newColor;
  target.classList.add('filled');
  floodFill(x - 1, y, oldColor, newColor);
  floodFill(x, y - 1, oldColor, newColor);
  floodFill(x + 1, y, oldColor, newColor);
  floodFill(x, y + 1, oldColor, newColor);
}

function drawPalette(colors = ['blue', 'red', 'black', 'white']) {
  // console.log(colors.length);
  for (let i = 0; i < colors.length; i++) {
    let colorDiv = document.createElement('div');
    colorDiv.className = `color-${i + 1}`;
    colorDiv.style.backgroundColor = colors[i];
    colorDiv.style.width = `${container.clientWidth / colors.length }px`;
    colorDiv.style.height = '40px';
    palette.appendChild(colorDiv);
  }
}

function cleanCell(target) {
  if (!target) return;

  let cell = document.querySelector(
    `.cell[x='${getX(target)}'][y='${getY(target)}']`
  );
  cell.style.backgroundColor = target.oldColor;

  if (!historyPaint.find(
      (el) => el.hashCode === target.hashCode)) {
    cell.classList.remove('filled');
  }
}


function stepBack(e) {
  e = e || window.event;
  let code = e.which || e.keyCode;

  // press Ctrl + Z
  if (code === 90 && e.ctrlKey && historyPaint.length !== 0) {
    let target = historyPaint.pop();

    if (!target.countOfFloodFill) {
      // simple clean cell
      cleanCell(target);
    } else {
      // clean after flood fill
      let count = target.countOfFloodFill;
      cleanCell(target);
      for (let i = 0; i < count - 1; i++) {
        target = historyPaint.pop();
        cleanCell(target);
      }
    }
  }
}


function whichColor(e) {
  let code = e.which || e.keyCode;
  if (code !== 3) {
    return currentFirstColor;
  }
  return currentSecondColor;
}

function clearCanvas() {
  ls.clear();
  historyPaint = [];
  repaintCanvas(null, sizeCanvas.value);
}

function isDelete(e) {
  e = e || window.event;
  return e.keyCode !== 8 ? e.preventDefault() : true;
}

function getSizeCanvas() {
  return ls.hasOwnProperty(keySizeCanvas) ? ls.getItem(keySizeCanvas) : 40;
}


document.addEventListener('DOMContentLoaded', () => {
  drawCanvas(getSizeCanvas());
  drawPalette(COLORS);
  loadCanvas();
}, false);
