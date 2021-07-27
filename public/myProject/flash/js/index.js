window.onload = function(){
    document.getElementsByTagName("ul")[0].className = "init";
}
var oLi = document.getElementsByTagName('li');
var len = oLi.length;
for (var i = 0; i < len; i++) {
    oLi[i].onmouseenter = function(e){
        var dir = getDirection(e,this);
        var oDes = this.getElementsByClassName('des')[0];
        oDes.className = 'des';
        switch(dir){
            case 0:
                oDes.classList.add('in-top');
                break;
            case 1:
                oDes.classList.add('in-right');
                break;
            case 2:
                oDes.classList.add('in-bottom');
                break;
            case 3:
                oDes.classList.add('in-left');
        }
        
    }
    oLi[i].onmouseleave = function(e){
        var dir = getDirection(e,this);
        var oDes = this.getElementsByClassName('des')[0];
        oDes.className = 'des';
        switch(dir){
            case 0:
                oDes.classList.add('out-top');
                break;
            case 1:
                oDes.classList.add('out-right');
                break;
            case 2:
                oDes.classList.add('out-bottom');
                break;
            case 3:
                oDes.classList.add('out-left');
        }
    }
    
}
function getDirection(e,ele){
    var w = ele.offsetWidth;
    var h = ele.offsetHeight;
    var x = (e.offsetX - w/2) * (w > h ? h/w : 1);
    var y = (e.offsetY - h/2) * (h > w ? w/h : 1);
    return (Math.round((Math.atan2(y,x) * (180/Math.PI) + 180)/90) + 3) % 4;

}