var oAudio = document.getElementById('audio'),
    oCurrentTime = document.getElementsByClassName('current-time')[0],
    oAllTime = document.getElementsByClassName('all-time')[0],
    oBtn = document.getElementsByClassName('btn')[0],
    proValue = document.getElementsByClassName('progress-value')[0],
    oPointBox = document.getElementsByClassName('point-box')[0],
    oProgress = document.getElementsByClassName('progress')[0];
    imgMove = document.getElementById('move'),
    oVolume = document.getElementsByClassName('volume')[0],
    volWrapper = document.getElementsByClassName('vol-wrapper')[0],
    volBg = document.getElementsByClassName('vol-bg')[0],
    volBox = document.getElementsByClassName('vol-box')[0],
    volValue = document.getElementsByClassName('vol-value')[0],
    oNext = document.getElementsByClassName('next')[0],
    oLast = document.getElementsByClassName('last')[0],
    oImg = document.getElementsByClassName('main')[0].getElementsByTagName('img')[0],
    musName = document.getElementsByClassName('music-name')[0];


    
var oWidth = 320,
    duration,
    timeUp,
    volHeight = 120,
    musIndex = ['./source/1.mp3','http://music.163.com/song/media/outer/url?id=277822.mp3','./source/3.mp3'],
    musicNum = 0,
    imgIndex = ['./img/1.png','./img/2.jpg','./img/3.jpg'],
    nameIndex = ['你还怕大雨吗 - 周柏豪','电台情歌 - 莫文蔚','让我留在你身边 - 陈奕迅'];

oAudio.oncanplay = function () {
    duration = this.duration
    oAllTime.innerHTML = playTime(duration);
    
}
oBtn.onmouseup = function(){
    if (oAudio.paused) {
        musicPlay();
    }else{
        musicPause();
    }
    
    
}

// 音乐播放
function musicPlay(){
    oAudio.play();
    oBtn.getElementsByTagName('i')[0].className = 'iconfont icon-zanting1';
    timeUp = setInterval(getCurrentTime,200);
    imgMove.className = 'move';
    imgMove.style.animationPlayState = 'running'

    oPointBox.onmousedown = function(){
        clearInterval(timeUp);
        var c = oAudio.currentTime;
        document.body.onmousemove = function(e){
            var newWidth = e.clientX - oProgress.getBoundingClientRect().left;
            
            if (newWidth < 0) {
                newWidth = 0;
            }else if(newWidth >320){
                newWidth = 320;
            }
            c = newWidth / oWidth *duration;
            oCurrentTime.innerHTML = playTime(c);
            proValue.style.width = newWidth + 'px';
        }
        document.body.onmouseup = function(){
            document.body.onmousemove = null;
            document.body.onmouseup = null;
            oAudio.currentTime = c;
            musicPlay();
        }
    
        
    }
}

// 音乐暂停
function musicPause(){
    oAudio.pause();
    oBtn.getElementsByTagName('i')[0].className = 'iconfont icon-bofang2';
    clearInterval(timeUp);
    imgMove.style.animationPlayState = 'paused';
}

function playTime(a) {
    
    var min = parseInt(a / 60);
    if (min < 10) {
        min = '0' + min; 
    }
    var sec = parseInt(a % 60);
    if (sec < 10) {
        sec = '0' + sec;
    }
    return min + ':' + sec;
}
function getCurrentTime(){
    oCurrentTime.innerHTML = playTime(oAudio.currentTime);
    proValue.style.width = oAudio.currentTime / duration * oWidth + 'px';
}

// 音乐结束开始下一首
oAudio.onended = function(){
    nextMusic();
    musicPlay();
}

// 音量调节
oVolume.onclick = function(){
    if (volWrapper.className == 'vol-wrapper show') {
        volWrapper.classList.remove('show');
    }else{
        volWrapper.classList.add('show');
    }
}
volBox.onmousedown = function(){
    var c;
    document.body.onmousemove = function(e){
        var newHeight =volHeight - (e.clientY - volBg.getBoundingClientRect().top);
        
        if (newHeight < 0) {
            newHeight = 0;
        }else if(newHeight > 120){
            newHeight = 120;
        }
        c = newHeight / volHeight;
        oAudio.volume = c;
        volValue.style.height = newHeight + 'px';
    }
    document.body.onmouseup = function(){
        document.body.onmousemove = null;
        document.body.onmouseup = null;
    }
}

// 上一首音乐
function lastMusic(){
    musicPause();
    musicNum -= 1;
    if (musicNum < 0) {
        musicNum = musIndex.length -1;;
    }
    oAudio.src = musIndex[musicNum];
    oImg.src = imgIndex[musicNum];
    musName.innerHTML = nameIndex[musicNum];
    imgMove.className = '';
    oAudio.currentTime = 0;
    oCurrentTime.innerHTML = playTime(oAudio.currentTime);
    proValue.style.width = '0';
}
oLast.onclick = function(){
    if (!oAudio.paused) {
        lastMusic();
        musicPlay();
    }else{
        lastMusic();
    }
}

// 下一首音乐
function nextMusic(){
    musicPause();
    musicNum += 1;
    if (musicNum > musIndex.length -1) {
        musicNum = 0;
    }
    oAudio.src = musIndex[musicNum];
    oImg.src = imgIndex[musicNum];
    musName.innerHTML = nameIndex[musicNum];
    imgMove.className = '';
    oAudio.currentTime = 0;
    oCurrentTime.innerHTML = playTime(oAudio.currentTime);
    proValue.style.width = '0';
}

oNext.onclick = function(){
    
    if (!oAudio.paused) {
        nextMusic();
        musicPlay();
    }else{
        nextMusic();
    }
    
}