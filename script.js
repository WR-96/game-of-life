var canvas, ctx, w, h;
var cellSize = 25;

class Cell {
    constructor(xCoord, yCoord, size, isAlive, neighbours, ) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.size = size;
        this.isAlive = isAlive;
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

    notifyNeighbours(isAlive) {
        // If the cell is alive then he tells is neighbours
        if (isAlive) {

        }

    }

    changeStatus() {
        this.isAlive = !this.isAlive;
        this.notifyNeighbours(this.isAlive);
    }

}

//Sall we add the 'ctx' as a property of this class?
class CellManager {
    add(cell) {
        CellManager.cells.push(cell);
    }

    cellClicked(x, y) {
        for (var i = 0; i < CellManager.cells.length; i++) {
            for (var j = 0; j < CellManager.cells[i].length; j++) {
                var cell = CellManager.cells[i][j];
                if (
                    inRange(x, cell.xCoord, cell.xCoord + cell.size) &&
                    inRange(y, cell.yCoord, cell.yCoord + cell.size)
                ) {
                    console.log('cell clicked found');
                    console.log('Cell array row: ' + i + ', column: ' + j);
                    cell.changeStatus();
                    console.log('cell status is alive: ' + cell.isAlive);
                    (cell.isAlive) ? cell.draw(ctx) : cell.clear(ctx);
                    break;
                }
            }
        }
    }
}

CellManager.cells = [];

var cellManager = new CellManager();

window.onload = function init() {
    canvas = document.querySelector('#board');
    canvas.addEventListener('click', mouseCliked);

    var btnNext = document.querySelector('#btnNext');
    // btnNext.onclick = cellManager.next();

    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext('2d');

    drawGrid(cellSize);

    createAllCells(cellSize);
}

function drawGrid(sqrSize) {
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

function createAllCells(cellSize) {
    for (var j = 0; j <= h - cellSize; j += cellSize) {
        var cellsRow = []
        for (var i = 0; i <= w - cellSize; i += cellSize) {
            var cell = new Cell(i, j, cellSize, false, 0);
            cellsRow.push(cell);
        }
        cellManager.add(cellsRow);
    }


}

function mouseCliked(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log('Mouse clicked in position x: ' + mousePos.x + ', y: ' + mousePos.y);
    cellManager.cellClicked(mousePos.x, mousePos.y);
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