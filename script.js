var canvas, ctx, w, h;

window.onload = function init() {
    canvas = document.querySelector("#board");

    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext('2d');

    drawGrid(25);
}

function drawGrid (sqrtSize) {
    ctx.save();

    for (var x = 0; x <= h; x += sqrtSize) {
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);
    }
    
    for (var y = 0; y <= w; y += sqrtSize) {
        ctx.moveTo(0,y);
        ctx.lineTo(w, y)
    }

    ctx.strokeStyle =" #00008B";
    ctx.stroke();
    ctx.restore;
}