var img = ['./img/1.png','./img/2.png','./img/3.png','./img/4.png',
                    './img/5.png','./img/6.png','./img/7.png','./img/8.png',
                    './img/9.png','./img/10.png','./img/11.jpg'];
var winWidth = $(window).width(),
    imgWidth = winWidth * 0.24,
    winHeight = $(window).height(),
    index,
    len = 11;

$('.item').each(function(index){
    // $(this).css('background-color','red');
    $(this).css('background-image','url(' + img[index] + ')');
})
    .css('height',imgWidth);

$('.item').on('tap',function(){
    clk(this) 
})

$('.item').on('swipeRight',function(){
    move('prev');
})
.on('swipeLeft',function(){
    move('next');
})

function clk(ele){
    index = $(ele).index();
    var distance = - winWidth * index;
    $('div').addClass('wrapper');
    $('ul').addClass('album');
    $('.album').css('margin-left',distance);
    $('.item').css({
        'width':winWidth,
        'height':winHeight,
        'background-size':'contain'
    })
    .off('tap');
}
$('.item').on('swipeDown',function(){
    $('.album').css('margin-left','0');
    $('.wrapper').removeClass('wrapper');
    $('.album').removeClass('album');
    $('.item').css({
        'width':imgWidth,
        'height':imgWidth,
        'background-size':'cover'
    })
    $('.item').on('tap',function(){
        clk(this) 
    })
    
});




function move(direction){
    if (direction == 'prev') {
        if (index > 0) {
            index--;
            $('.album').animate({
            marginLeft:-index * winWidth
            },100);
        }
        
    }else if(direction == 'next'){
        if (index < len - 1) {
            index ++;
            $('.album').animate({
            marginLeft: -index * winWidth
            },100);
        }
        
    }
}
