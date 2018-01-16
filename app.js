/*
  pchart-api 服务
*/

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var redisClient = require('./config/redis').redisClient;
var log4js = require('./middleware/log4jsLogger')
var logger = log4js.getLogger('access');

/**
 * 初始化 express
 */

 var app = express();


 /**
 * 引入中间件
 */


app.use(log4js.connectLogger(logger,{level:log4js.levels.INFO}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))// 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(cookieParser());

/*
  * 添加session状态
 * cookie maxAge : 1800000(毫秒) 30分钟过期
 * session expire : 1800(秒)    30分钟过期
*/

app.use(expressSession({
  secret: 'a4f8071f-c873-4447-8ee2',
  cookie: { maxAge: 1800000 },
  store : new RedisStore({
    client : redisClient,
    ttl : 90000 //session有效期 单位 秒
  }),
  resave: false,
  saveUninitialized:false
}))

/**
 * 静态目录
 */

 app.use(express.static(path.join(__dirname,'public')));


 /**
 * 加载路由
 */

 require('./routes/index')(app);

 /**
 * 404 或 错误处理
 */

app.use(function(req,res,next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use(function(err,req,res,next){
  res.locals.message = err.message;
  res.locals.error = err

  logger.error('>>>>>>error>>>>>>')
  logger.error(err)
  logger.error('<<<<<<<<<<<<<<<<<')

  var num = Math.floor(Math.random()*38);
  if (req.path.indexOf('/img/') != -1) return res.sendFile(__dirname + `/public/img/${num}.png`)

  res.status(err.status || 500);
  res.json({code:1,message:err.message || 'error'}) 
})

console.log()
console.log('----------------------------------------------------')
console.log()
console.log('> Date : ', new Date())

module.exports = app;