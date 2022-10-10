require('./models/associationTable')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var studentRouter = require('./routes/studentRouter')
var teacherRouter = require('./routes/teacherRouter')





var app = express();

app.use(express.json());//数据JSON类型
app.use(express.urlencoded({ extended: false }));//解析post请求数据

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// view engine setup

//用art-template引擎替换默认的jade引擎
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all("*",function(req,res,next){
  res.header("Access-Control-Allow-Credentials", "true")
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin",req.headers.origin ||"http://localhost:8080");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","*");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
});


app.get('/estudy',function(req,res){
  res.render('myProject/estudy/index')
})
app.get('/bootstrap',function(req,res){
  res.render('myProject/bootstrap/index')
})
app.get('/clock',function(req,res){
  res.render('myProject/clock/index')
})
app.get('/flash',function(req,res){
  res.render('myProject/flash/index')
})
app.get('/mi',function(req,res){
  res.render('myProject/mi/index')
})
app.get('/Mine',function(req,res){
  res.render('myProject/Mine/index')
})
app.get('/mobileAlbum',function(req,res){
  res.render('myProject/mobileAlbum/index')
})
app.get('/musicplayer',function(req,res){
  res.render('myProject/musicplayer/index')
})
app.get('/scratch',function(req,res){
  res.render('myProject/scratch/index')
})

app.use('/auth', indexRouter);
// app.use('/users', usersRouter);

app.use('/student',studentRouter)

app.use('/teacher',teacherRouter)

app.listen(80,()=>{
  console.log('正在监听')
})



module.exports = app;
