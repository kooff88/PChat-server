var redisClient = require('./redis').redisClient;
var config = require('./config.js')
var io = require('socket.io')(config.socket.port)
var HALF_HOUR_IN_SEC = 1800;

// 使用中间件
io.use((socket,next) => {
  let token = socket.handshake.query.token;
  if (!token) return next(new Error('token不存在,请先登录后再连接socket'));
  // 重新设置超时
  redisClient.expire(`socket-io-token-${token}`,HALF_HOUR_IN_SEC)
  return next();
})

// 连接
io.sockets.on('connection', function(socket){
  let token = socket.handshake.query.token;
  let value = socket.id;
  redisClient.set(`socket-io-token-${token}`,value,'EX',HALF_HOUR_IN_SEC,function(err,result){
    err ? socket.emit('unsave-to-redis','redis存储失败') : socket.emit('connection', 'socket连接成功');
  })
})

io.sockets.on('disconnect',function (){
  io.sockets.emit('socket连接断开')
})

/**
 * 发送消息
 * 
 * @param {*} token 
 * @param {*} data 
 * @param {*} event 
 * @param {*} callback 
 */

 function emit(token,data,event,callback){
  if (!token || !data){ callback && callback(new Error('token 或 发送内容不存在')); return; }

  redisClient.get(`socket-io-token-${token}`,function(err,value){
    if (err){ callback && callback(new Error('token 获取错误，请稍后重新连接socket')); return }
    if (!value) { callback && callback(new Error('token 不存在，请先登录后再连接socket')); return; }
    
    io.sockets.sockets[value] && io.sockets.sockets[value].emit(event || 'chat',data)
  })
 }

 exports.io = io;
 exports.emit = emit;