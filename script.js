var canvas, ctx;//, w, h;
var cellSize = 25;
var isPlaying = false;

class Cell {
    constructor(xCoord, yCoord, size, isAlive = false, neighbours = 0, aroundCells = []) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.size = size;
        this.isAlive = isAlive;
        this.neighbours = neighbours;
        this.aroundCells = aroundCells;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#33cc33';
        ctx.translate(this.xCoord + 1, this.yCoord + 1);
        ctx.fillRect(0, 0, this.size - 2, this.size - 2);
        ctx.restore();
    }

    clear(ctx) {
        ctx.save();
        ctx.translate(this.xCoord + 1, this.yCoord + 1);
        ctx.clearRect(0, 0, this.size - 2, this.size - 2);
        ctx.restore();
    }

    changeStatus() {
        this.isAlive = !this.isAlive;
        (this.isAlive) ? this.draw(ctx) : this.clear(ctx);
    }

}

class BoardManager {
    constructor(ctx, cellSize) {
        this.ctx = ctx;
        this.cellSize = cellSize;
    }

    add(cell) {
        BoardManager.cells.push(cell);
    }

    cellClicked(x, y) {
        var row, column, cell;

        for (row = 0; row < BoardManager.cells.length; row++) {
            for (column = 0; column < BoardManager.cells[row].length; column++) {
                cell = BoardManager.cells[row][column];
                if (
                    inRange(x, cell.xCoord, cell.xCoord + cell.size) &&
                    inRange(y, cell.yCoord, cell.yCoord + cell.size)
                ) {
                    console.log('cell clicked found');
                    console.log('Cell array row: ' + row + ', column: ' + column);
                    console.log('This cell has ' + cell.aroundCells.length + ' cells around');
                    cell.changeStatus();
                    this.notifyNeighbours(cell);
                    console.log('cell status is alive: ' + cell.isAlive +'\n\n');
                    break;
                }
            }
        }
    }

    //Change to notify status
    notifyNeighbours(cell) {
        cell.aroundCells.forEach(function (neighbour) {
            (cell.isAlive) ? neighbour.neighbours++ : neighbour.neighbours--;
        });
    }

    setAroundCells() {
        var rowsLimit = BoardManager.cells.length - 1;
        var columnsLimit = BoardManager.cells[0].length - 1;
        var firstRow, lastRow;
        var firstColumn, lastColumn;

        BoardManager.cells.forEach(function (row, rowIndex) {
            firstRow = clamp(rowIndex - 1, 0, rowsLimit);
            lastRow = clamp(rowIndex + 1, 0, rowsLimit);

            row.forEach(function (cell, columnIndex) {
                firstColumn = clamp(columnIndex - 1, 0, columnsLimit);
                lastColumn = clamp(columnIndex + 1, 0, columnsLimit);

                fillAroundCellsArray(cell);
            });
        });

        function fillAroundCellsArray(cell) {
            var i, j;
            for (i = firstRow; i <= lastRow; i++) {
                for (j = firstColumn; j <= lastColumn; j++) {
                    //The cell does not have to count hiself as a neighbour
                    if (cell !== BoardManager.cells[i][j])
                        cell.aroundCells.push(BoardManager.cells[i][j]);
                }
            }
        }
    }

    nextGeneration() {
        console.log('Next generation created \n\n');
        var changedStatus = [];

        BoardManager.cells.forEach(function (row) {
            row.forEach(function (cell) {
                var oldStatus = cell.isAlive;
                checkRules(cell);
                //Notify only on status changed
                if (oldStatus !== cell.isAlive) {
                    changedStatus.push(cell);
                }
            });
        });

        changedStatus.forEach(function (cell) {
            this.notifyNeighbours(cell);
        }, this);

        function checkRules(cell) {
            if (cell.isAlive) {
                if (cell.neighbours <= 1) {
                    cell.changeStatus();
                }
                if (cell.neighbours >= 4) {
                    cell.changeStatus();
                }
            } else {
                if (cell.neighbours === 3)
                    cell.changeStatus();
            }
        }
    }

    drawGrid() {
        var h = ctx.canvas.height;
        var w = ctx.canvas.width;
        var x = cellSize, y = cellSize;

        ctx.save();
        ctx.lineWidth = 2;
        for (x = cellSize; x <= w - cellSize; x += cellSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }

        for (y = cellSize; y <= h - cellSize; y += cellSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y)
        }

        ctx.strokeStyle = '#00008B';
        ctx.stroke();
        ctx.restore;
    }

    createAllCells() {
        var i, j;
        for (j = 0; j <= ctx.canvas.height - cellSize; j += cellSize) {
            var cellsRow = []
            for (i = 0; i <= ctx.canvas.width - cellSize; i += cellSize) {
                var cell = new Cell(i, j, cellSize);
                cellsRow.push(cell);
            }
            this.add(cellsRow);
        }
        this.setAroundCells();
    }

    clearBoard() {
        var h = ctx.canvas.height;
        var w = ctx.canvas.width;

        ctx.clearRect(0, 0, w, h);
        this.drawGrid();
        BoardManager.cells = [];
        this.createAllCells();
    }
}

BoardManager.cells = [];

var manager = new BoardManager(ctx, cellSize);

window.onload = function init() {
    canvas = document.querySelector('#board');
    canvas.addEventListener('click', mouseCliked);

    var btnNext = document.querySelector('#btnNext');
    btnNext.addEventListener('click', manager.nextGeneration.bind(manager));

    var btnClear = document.querySelector('#btnClear');
    btnClear.addEventListener('click', manager.clearBoard.bind(manager));

    var btnAnimate = document.querySelector('#btnPlay');
    btnAnimate.addEventListener('click', startStopAnimation);

    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext('2d');

    manager.drawGrid(cellSize);

    manager.createAllCells(cellSize);
}

function startStopAnimation(evt) {
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

function mouseCliked(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log('Mouse clicked in position x: ' + mousePos.x + ', y: ' + mousePos.y +'\n\n');
    manager.cellClicked(mousePos.x, mousePos.y);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function clamp(number, min, max) {
    return Math.max(Math.min(number, max), min);
}

function inRange(number, min, max) {
    return number > min && number < max;
}