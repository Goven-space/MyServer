var myCanvas = document.getElementById('myCanvas');
var ctx = myCanvas.getContext('2d');
var w = myCanvas.width;
var h = myCanvas.height;
var lastPos = {};

var img = new Image();
var imgCover = new Image();
imgCover.src = './myProject/scratch/fengmian.jpg';
var newImg = Math.random();
if (newImg > 0.7) {
    img.src = './myProject/scratch/zhongjiang.jpg';
}else{
    img.src = './myProject/scratch/xiexie.jpg';
}

function init(){
    img.onload = function(){
        myCanvas.style.backgroundImage = 'url(' + img.src + ')';
        ctx.beginPath();
        var fm = ctx.createPattern(imgCover,'no-repeat');
        ctx.translate(-50,-50);
        // ctx.fillStyle = '#aaa';
        // ctx.fillRect(0,0,w,h);
        ctx.fillStyle = fm;
        ctx.fillRect(0,0,w+50,h+50);
        ctx.translate(50,50);
        ctx.globalCompositeOperation = 'destination-out';
        myCanvas.addEventListener('mousedown',downFun);
        
    }
}
init();

function downFun(e){
    lastPos.x = e.clientX - myCanvas.offsetLeft;
    lastPos.y = e.clientY - myCanvas.offsetTop;
    ctx.beginPath();
    ctx.arc(lastPos.x,lastPos.y,40,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    
    myCanvas.addEventListener('mousemove',moveFun);
    document.body.addEventListener('mouseup',upFun);
}

function moveFun(e){   
    var x = e.clientX - myCanvas.offsetLeft;
    var y = e.clientY - myCanvas.offsetTop;

    
    ctx.beginPath();
    ctx.moveTo(lastPos.x,lastPos.y);
    ctx.lineTo(x,y);
    ctx.lineWidth = 80;
    ctx.lineCap = 'round';
    ctx.stroke();

    

    lastPos.x = x;
    lastPos.y = y;

}

function upFun(){
    myCanvas.removeEventListener('mousemove',moveFun);
    document.body.removeEventListener('mouseup',upFun);
    clearCover();
}

function clearCover(){
    var imgData = ctx.getImageData(0,0,w,h);
    var sum = 0;
    console.log(imgData.data);
    for(var i = 3; i < imgData.data.length ; i+=4){
        if (imgData.data[i] == 0) {
            sum += 1;
        }
    }
    if (sum > w*h*0.4) {
        ctx.clearRect(0,0,w,h);
    }
}