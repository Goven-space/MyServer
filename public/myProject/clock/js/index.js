var numBox = document.getElementsByClassName('clock-num')[0];
var hou = document.getElementsByClassName('hou')[0];
var min = document.getElementsByClassName('min')[0];
var sec = document.getElementsByClassName('sec')[0];

//动态创建1-12刻度
function init(){
    var str = '';
    for (let i = 1; i < 13; i++) {
        str += "<li class = num style = 'transform: rotate(" + i * 30 + "deg)' ><span style = 'transform: rotate("+ i * -30 +"deg)'>" + i + "</span></li>"
        
    }
    numBox.innerHTML = str;
}
init();

function show(){
    var date = new Date()
    //获取小时
    var hour = date.getHours();
    //获取分钟
    var minute = date.getMinutes();
    //获取秒数
    var second = date.getSeconds()
    //获取毫秒数
    var msec = date.getMilliseconds();
    //计算秒针度数
    var fillSecond = second + msec /1000;
    var ds = fillSecond *6;
    //计算分针度数
    var fillMinute = minute + fillSecond / 60;
    var dm = fillMinute * 6;
    //计算时针度数
    var fillHour = hour + fillMinute / 60;
    var dh = fillHour *30;

    hou.style.transform = 'rotate(' + dh + 'deg)';
    min.style.transform = 'rotate(' + dm + 'deg)';
    sec.style.transform = 'rotate(' + ds + 'deg)';
    //浏览器刷新前执行一次
    requestAnimationFrame(show);
}
show();