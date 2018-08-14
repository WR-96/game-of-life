var isPlaying = false;

window.onload = function init() {
    var cellSize = 25;
    var canvas, ctx, manager;
    var btnAnimate, btnClear, btnNext;

    var canvas = document.querySelector('#board');
    canvas.addEventListener('click', function (evt) { mouseCliked(evt, manager); });

    ctx = canvas.getContext('2d');

    manager = new BoardManager(ctx, cellSize);

    btnNext = document.querySelector('#btnNext');
    btnNext.addEventListener('click', manager.nextGeneration.bind(manager));

    btnClear = document.querySelector('#btnClear');
    btnClear.addEventListener('click', manager.clearBoard.bind(manager));

    btnAnimate = document.querySelector('#btnPlay');
    btnAnimate.addEventListener('click', function (evt) { startStopAnimation(evt, manager) });

    manager.drawGrid();
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

function mouseCliked(evt, manager) {
    var mousePos = getMousePos(evt);
    console.log('Mouse clicked in position x: ' + mousePos.x + ', y: ' + mousePos.y + '\n\n');
    manager.cellClicked(mousePos.x, mousePos.y);
}

function getMousePos(evt) {
    var rect = evt.target.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}