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