const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const body = document.body;
// Control
const lineWidth = document.getElementById("line-width");
const trans = document.getElementById("trans");
// Color
const color = document.getElementById("color");
const colorOptions = Array.from(
    document.querySelectorAll(".color-option")
);
// Tools
const brush = document.getElementById("brush");
const fill = document.getElementById("fill"); 
const eraser = document.getElementById("eraser");
const reset = document.getElementById("reset");
const file = document.getElementById("file");
const circle = document.getElementById("circle");
const rect = document.getElementById("rect");
const save = document.getElementById("save");
// Text
const txtInput = document.getElementById("text");
const fontSize = document.getElementById("font-size");
const fontW = document.getElementById("font-weight");

const { width, height } = canvas.getBoundingClientRect();
canvas.width = width - 2;
canvas.height = height - 2;
const CANVAS_WIDTH = ctx.canvas.width;
const CANVAS_HEIGHT = ctx.canvas.height;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false; 
let filledColor = "white";


// mode 0: initial | 1: eraser | 2: fill | 3: circle | 4: rectangle | 5: txt
let mode = 0;
let rectX;
let rectY;


// Resize
function resizeCanvas(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width  !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}

// Move
function onMove(e){
    resizeCanvas(ctx.canvas);
    if(isPainting){
        if(mode === 0 || mode === 1){
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            return;
        }else if(mode === 3){
            const x = e.offsetX;
            const y = e.offsetY;
            const w = x - rectX;
            const h = y - rectY;
            ctx.moveTo(x, y);
            ctx.fillRect(rectX, rectY, w, h);
        }else if(mode === 4){
            const circleX = e.offsetX;
            const circleW = circleX - rectX;
            ctx.arc(rectX, rectY, circleW, 0, Math.PI*2, true);
            ctx.fill();
        }
    }
    ctx.moveTo(e.offsetX, e.offsetY);
}

// Painting Figures
function painting(e){
    isPainting = true;
    if(mode === 3 || mode === 4){
        rectX = e.offsetX;
        rectY = e.offsetY;
    }
}

// Cancel
function cancelPainting(){
    isPainting = false;
    ctx.beginPath();
}

// Control
function lineWidthChange(e){
    ctx.lineWidth = e.target.value;
    const widthT = document.getElementById("width-title");
    widthT.innerText = e.target.value;
}

// Color
function colorChange(e){
    ctx.strokeStyle = ctx.fillStyle = e.target.value;
}
function colorClick(e){
    const colorValue = e.target.dataset.color;
    ctx.strokeStyle = ctx.fillStyle = color.value = colorValue;
    body.classList.remove("cursor-eraser", "cursor-brush");
}

// Fill
function onFill(){
    mode = 2;
    body.classList.add("cursor-bucket");
    filledColor = ctx.fillStyle;
}

function canvasClick(e) {
    if(mode === 2){
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        filledColor = ctx.fillStyle;
    }else if(mode === 5){
        const txt = txtInput.value;
        const txtSize = fontSize.value;
        const txtW = fontW.value;
        if (txt !== ""){
            if(isNaN(txtSize) || txtSize < 1){
                modal.classList.remove("hidden");
            }else{
                ctx.lineWidth = 1;
                ctx.font = `${txtW} ${txtSize}px Noto Sans KR`;
                ctx.fillText(txt, e.offsetX, e.offsetY);
                ctx.lineWidth = lineWidth.value;
            }
        }
    }
}

// Reset
function onReset(){
    modalC.classList.remove("hidden");
}
function modalY(){
    modalC.classList.add("hidden")
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    filledColor = "white";
    body.className = "";
    ctx.strokeStyle = ctx.fillStyle;   
    if(mode === 2){
        body.className = "cursor-bucket";
    }else if(mode === 3 || mode === 4){
        body.className = "cursor-plus";
    }
}
function modalN(){
    modalC.classList.add("hidden")
}

// Eraser
function onEraser(){
    mode = 1;
    ctx.strokeStyle = filledColor;
    body.className = "cursor-eraser";
}

// Image Upload
function fileChange(e){
    const file = e.target.files[0];
    const url = URL.createObjectURL(file); 
    const img = new Image();
    img.src = url;
    img.onload = function(){
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

// Brush
function onBrush(){
    mode = 0;
    ctx.strokeStyle = ctx.fillStyle;
    body.className = "";
}

// Text
function txtClick(){
    mode = 5;
    body.className = "cursor-stamp";
}

// Save
function onSave(){
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png"
    a.click();
}

// Figures
function onRect(){
    mode = 3;
    body.className = "cursor-plus";
}
function onCircle(){
    mode = 4;
    body.className = "cursor-plus";
}

// Transparency
function onTrans(e){
    ctx.globalAlpha = e.target.value;
    const transT = document.getElementById("trans-title");
    transT.innerText = e.target.value;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("touchmove", onMove);
canvas.addEventListener("mousedown", painting);
canvas.addEventListener("touchstart", painting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("touchend", cancelPainting);
canvas.addEventListener("click", canvasClick);
canvas.addEventListener("mouseleave", cancelPainting);

color.addEventListener("change", colorChange);
colorOptions.forEach((color) => color.addEventListener("click", colorClick));

brush.addEventListener("click", onBrush);
fill.addEventListener("click", onFill);
eraser.addEventListener("click", onEraser);
reset.addEventListener("click", onReset);
file.addEventListener("change", fileChange);
circle.addEventListener("click", onCircle);
rect.addEventListener("click", onRect);
save.addEventListener("click", onSave);

lineWidth.addEventListener("change", lineWidthChange);
trans.addEventListener("change", onTrans);
txtInput.addEventListener("click", txtClick);

btnY.addEventListener("click", modalY);
btnN.addEventListener("click", modalN);