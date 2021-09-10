var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const jwt = require('jsonwebtoken');
var session = require('express-session');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var recordRouter = require('./routes/love-record');
var diaryRouter = require('./routes/diary');
const config = require('./config.json');
var history = require('connect-history-api-fallback');

var app = express();
app.use(session({
  name: 'us',
  cookie:{
    // 使用HTTPS可设为true
    // secure: true,
    maxAge:30*24*60*60000
  },
  secret: config.session_secret,
  resave: false,
  saveUninitialized: true,
}));
app.use(history());
app.use(function(req, res, next) {

    res.header('Access-Control-Allow-Origin', req.headers.origin);
  
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  
  //   res.header('Access-Control-Expose-Headers', 'token');
  
    res.header('Access-Control-Allow-Headers','X-Requested-With,Content-Type,token');
  
    res.header('Access-Control-Allow-Credentials','true');
  
    // next();
    if (req.method.toLowerCase() == 'options') {
      res.sendStatus(200);  // 让options尝试请求快速结束
    } else {
      next();
    }
})

// 日志格式
logger.token('localDate',function getDate(req) {
  let targetTimezone = -8
  let _dif = new Date().getTimezoneOffset()
  let east8time = new Date().getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
  return new Date(east8time).toLocaleString()
})
logger.format('combined', '[:localDate] :remote-addr - :remote-user  :status ":referrer" ":user-agent"');
app.use(logger('combined'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态文件存储文件夹，如果不是前后端分离的话，需要把前端build生成的文件拷贝到public下
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRouter);
// 登录
app.use(async function(req, res, next){
  // if (req.method==="OPTIONS")
  //   return res.send()
  // let token = req.headers.token;
  try {
    if (!req.session.logined) {
      return res.status(403).json({ "msg": "请登录",outOfDate:true })
    }
  }
  catch (err) {
    return res.status(403).json({ "msg": "请登录",outOfDate:true })
  }
  req.session.cookie.maxAge = 30*24*60*60000;
  next();
})
app.use('/love-record',recordRouter);
app.use('/diary',diaryRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

function getToken(headers) {
  if (headers && headers.authorization) {
      var authorization = headers.authorization;
      var part = authorization.split(' ');

      if (part.length == 2) {
          var token = part[1];

          return part[1];
      }
      else {
          return null;
      }
  }
  else {
      return null;
  }
}

module.exports = app;
