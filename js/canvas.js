const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const body = document.body;
// Controls
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
let drawing = false;


// mode 0: initial | 1: eraser | 2: fill | 3: circle | 4: rectangle | 5: txt
let mode = 0;
let rectX;
let rectY;

// modal Message
let modalM1 = document.querySelector(".modalM1");
let modalM2 = document.querySelector(".modalM2");

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

// Touch
function getTouchPos(e) {
    return {
        x: e.touches[0].clientX - e.target.offsetLeft,
        y: e.touches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
    }
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
            const circleX = e.offsetX;
            const circleW = circleX - rectX;
            ctx.arc(rectX, rectY, circleW, 0, Math.PI*2, true);
            ctx.fill();
        }else if(mode === 4){
            const x = e.offsetX;
            const y = e.offsetY;
            const w = x - rectX;
            const h = y - rectY;
            ctx.moveTo(x, y);
            ctx.fillRect(rectX, rectY, w, h);
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

// Controls
function lineWidthChange(e){
    ctx.lineWidth = e.target.value;
    const widthV = document.getElementById("width-value");
    widthV.innerText = e.target.value;
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
                modalM2.classList.add("hidden");
                modalM1.classList.remove("hidden");
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
function onCircle(){
    mode = 3;
    body.className = "cursor-plus";
}
function onRect(){
    mode = 4;
    body.className = "cursor-plus";
}

// Transparency
function onTrans(e){
    ctx.globalAlpha = e.target.value;
    const transV = document.getElementById("trans-value");
    transV.innerText = e.target.value;
}

// touch
function draw(curX, curY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(curX, curY);
    ctx.stroke();
}
function touchStart(e) {
    body.classList.add("touch-action");
    if(mode !== 2 && mode !== 5 ){
        e.preventDefault();
        drawing = true;
        const { x, y } = getTouchPos(e);
        startX = x;
        startY = y;
    }
    if(mode === 3 || mode === 4){
        drawing = false;
        modalM1.classList.add("hidden");
        modalM2.classList.remove("hidden");
        modal.classList.remove("hidden");
    }
}
function touchMove(e) {
    if(!drawing) return;
    let { x, y } = getTouchPos(e);
    draw(x, y);
    startX = x;
    startY = y;
}
function touchEnd() {
    body.classList.remove("touch-action");
    if(!drawing) return;
    ctx.beginPath();
    drawing = false;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", painting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("click", canvasClick);
canvas.addEventListener("mouseleave", cancelPainting);

canvas.addEventListener("touchmove", touchMove, false);
canvas.addEventListener("touchstart", touchStart, false);
canvas.addEventListener("touchend", touchEnd, false);

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