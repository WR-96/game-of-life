// TODO make a button to clear the canvas and kill all the cells on the board
var canvas, ctx, w, h;
var cellSize = 25;

class Cell {
    constructor(xCoord, yCoord, size, isAlive = false, nearbyCells = 0, neighbours = []) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.size = size;
        this.isAlive = isAlive;
        this.nearbyCells = nearbyCells;
        this.neighbours = neighbours;
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
    constructor(ctx) {
        this.ctx = ctx;
    }

    add(cell) {
        BoardManager.cells.push(cell);
    }

    cellClicked(x, y) {
        for (var row = 0; row < BoardManager.cells.length; row++) {
            for (var column = 0; column < BoardManager.cells[row].length; column++) {
                var cell = BoardManager.cells[row][column];
                if (
                    inRange(x, cell.xCoord, cell.xCoord + cell.size) &&
                    inRange(y, cell.yCoord, cell.yCoord + cell.size)
                ) {
                    console.log('cell clicked found');
                    console.log('Cell array row: ' + row + ', column: ' + column);
                    console.log('This cell has ' + cell.neighbours.length + ' neighbours');
                    cell.changeStatus();
                    this.notifyNeighbours(cell);
                    console.log('cell status is alive: ' + cell.isAlive);
                    break;
                }
            }
        }
    }

    notifyNeighbours(cell) {
        cell.neighbours.forEach(function (neighbour) {
            (cell.isAlive) ? neighbour.nearbyCells++ : neighbour.nearbyCells--;
        });
    }

    setNeighbours() {
        var rowsLimit = BoardManager.cells.length - 1;
        var columnsLimit = BoardManager.cells[0].length - 1;

        for (var row = 0; row < BoardManager.cells.length; row++) {
            var firstRow = clamp(row - 1, 0, rowsLimit);
            var lastRow = clamp(row + 1, 0, rowsLimit);

            for (var column = 0; column < BoardManager.cells[row].length; column++) {
                var cell = BoardManager.cells[row][column];

                var firstColumn = clamp(column - 1, 0, columnsLimit);
                var lastColumn = clamp(column + 1, 0, columnsLimit);

                fillNeighboursArray();
            }
        }

        function fillNeighboursArray() {
            for (var i = firstRow; i <= lastRow; i++) {
                for (var j = firstColumn; j <= lastColumn; j++) {
                    //The cell does not have to count hiself as a neighbour
                    if (BoardManager.cells[row][column] !== BoardManager.cells[i][j])
                        cell.neighbours.push(BoardManager.cells[i][j]);
                }
            }
        }
    }

    nextGeneration() {
        console.log('Next generation created');
        var changedStatus = [];
        for (var row = 0; row < BoardManager.cells.length; row++) {
            for (var column = 0; column < BoardManager.cells[row].length; column++) {
                var cell = BoardManager.cells[row][column];
                var neighbours = cell.nearbyCells;
                var oldStatus = cell.isAlive;
                checkRules();
                //Notify only on status changed
                if (oldStatus !== cell.isAlive) {
                    changedStatus.push(cell);
                }
            }
        }

        changedStatus.forEach(function (cell) {
            this.notifyNeighbours(cell);
        }, this);

        function checkRules() {
            if (cell.isAlive) {
                if (neighbours <= 1) {
                    cell.changeStatus();
                }
                if (neighbours >= 4) {
                    cell.changeStatus();
                }
            } else {
                if (neighbours === 3)
                    cell.changeStatus();
            }
        }
    }

    drawGrid(sqrSize) {
        ctx.save();
        for (var x = sqrSize; x <= w - sqrSize; x += sqrSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
    
        for (var y = sqrSize; y <= h - sqrSize; y += sqrSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y)
        }
    
        ctx.strokeStyle = '#00008B';
        ctx.stroke();
        ctx.restore;
    }
    
    createAllCells(cellSize) {
        for (var j = 0; j <= h - cellSize; j += cellSize) {
            var cellsRow = []
            for (var i = 0; i <= w - cellSize; i += cellSize) {
                var cell = new Cell(i, j, cellSize);
                cellsRow.push(cell);
            }
            this.add(cellsRow);
        }
        this.setNeighbours();
    }

    clearBoard() {
        ctx.clearRect(0, 0, w, h);
        this.drawGrid(cellSize);
        BoardManager.cells = [];
        this.createAllCells(cellSize);
    }
}

BoardManager.cells = [];

var manager = new BoardManager(ctx);

window.onload = function init() {
    canvas = document.querySelector('#board');
    canvas.addEventListener('click', mouseCliked);

    var btnNext = document.querySelector('#btnNext');
    btnNext.addEventListener('click', manager.nextGeneration.bind(manager));

    var btnClear = document.querySelector('#btnClear');
    btnClear.addEventListener('click', manager.clearBoard.bind(manager));

    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext('2d');

    manager.drawGrid(cellSize);

    manager.createAllCells(cellSize);
}



function mouseCliked(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log('Mouse clicked in position x: ' + mousePos.x + ', y: ' + mousePos.y);
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