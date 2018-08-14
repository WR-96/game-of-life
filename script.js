var ctx;
var cellSize = 25;
var isPlaying = false;


window.onload = function init() {
    var canvas = document.querySelector('#board');
    canvas.addEventListener('click', function (evt) {mouseCliked(evt,manager);});
    
    ctx = canvas.getContext('2d');
    
    var manager = new BoardManager(ctx, cellSize);

    var btnNext = document.querySelector('#btnNext');
    btnNext.addEventListener('click', manager.nextGeneration.bind(manager));

    var btnClear = document.querySelector('#btnClear');
    btnClear.addEventListener('click', manager.clearBoard.bind(manager));

    var btnAnimate = document.querySelector('#btnPlay');
    btnAnimate.addEventListener('click', function (evt) {startStopAnimation(evt,manager)});

    manager.drawGrid(cellSize);
    manager.createAllCells(cellSize);
}

function startStopAnimation(evt, manager) {
    isPlaying = !isPlaying;
    evt.target.innerHTML = (isPlaying) ? 'Stop' : 'Start';
    var animation = setInterval(frame, 500);

    function frame() {
        if (isPlaying) {
            manager.nextGeneration();
        } else {
            clearInterval(animation);
        }
    }
}

function mouseCliked(evt,manager) {
    var mousePos = getMousePos(evt);
    console.log('Mouse clicked in position x: ' + mousePos.x + ', y: ' + mousePos.y +'\n\n');
    manager.cellClicked(mousePos.x, mousePos.y);
}

function getMousePos(evt) {
    var rect = evt.target.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}