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
        ctx.fillStyle = "#33cc33";
        ctx.translate(this.xCoord, this.yCoord);
        ctx.fillRect(0, 0, this.size, this.size);
        ctx.restore();
    }

    clear(ctx) {
        ctx.save();
        ctx.translate(this.xCoord, this.yCoord);
        ctx.clearRect(0, 0, this.size, this.size);
        ctx.restore(); 
    }

    greetNeighbours() {
        // If the cell is alive then he tells is neighbours
    }

    changeStatus() {
        this.isAlive = !this.isAlive;
    }

}

//Sall we add the 'ctx' as a property of this class?
class CellManager {
    add(cell) {
        CellManager.cells.push(cell);
    }

    cellClicked(x, y) {
        console.log(CellManager.cells.length);
        for(var i = 0; i < CellManager.cells.length; i++) {
            var cell = CellManager.cells[i];
            if (
                x > cell.xCoord &&
                x < cell.xCoord + cell.size &&
                y > cell.yCoord &&
                y < cell.yCoord + cell.size
            ) {
                console.log("cell clicked found");
                cell.changeStatus();
                console.log("cell status is alive: "+cell.isAlive);
                (cell.isAlive) ? cell.draw(ctx) : cell.clear(ctx);
                break;
            }
        }
    }
}

CellManager.cells = [];

var cellManager = new CellManager();

window.onload = function init() {
    canvas = document.querySelector("#board");
    canvas.addEventListener('click', mouseCliked);
    
    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext('2d');

    drawGrid(cellSize);

    createAllCells(cellSize);
}

function drawGrid (sqrSize) {
    ctx.save();
    for (var x = sqrSize; x <= w - sqrSize; x += sqrSize) {
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);
    }
    
    for (var y = sqrSize; y <= h - sqrSize; y += sqrSize) {
        ctx.moveTo(0,y);
        ctx.lineTo(w, y)
    }

    ctx.strokeStyle =" #00008B";
    ctx.stroke();
    ctx.restore;
}

function createAllCells(cellSize) {
    for (var i = 0; i <= w - cellSize; i += cellSize) {
        for(var j = 0; j <= h - cellSize; j += cellSize) {
            var cell = new Cell(i, j, cellSize, false, 0);
            cellManager.add(cell);
        }
    }


}

function mouseCliked(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log('Mouse clicked in position x: '+mousePos.x+', y: '+mousePos.y);
    cellManager.cellClicked(mousePos.x, mousePos.y);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}