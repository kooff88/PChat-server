var redis = require('redis');
var config = require('./config.js');
var fs = require('fs');
var path = require('path');
var redisClient = redis.createClient(config.redis);

redisClient.on('error',function(err){
  console.log('> redis 发生错误 :', err.message || '')
})

redisClient.on('connect',function(){
  console.log('> redis 连接成功');
})

var redis2Client = redis.createClient(config.redis);
var EVENT_SET = '__keyevent@0__:set';
var EVENT_DEL = '__keyevent@0__:del';
var EVENT_EXPIRE = '__keyevent@0__:expire';
var EVENT_EXPIRED = '__keyevent@0__:expired';
redis2Client.on('message',function(channel,key){
  switch (channel){
    case EVENT_SET :
      console.log('> Redis Key "' + key + '" set !')
       break;
    case EVENT_DEL:
      console.log('> Redis Key "' + key + '" deleted!');
      break;
    case EVENT_EXPIRE:
      console.log('> Redis Key "' + key + '" expire!');
      break;
  }
})
redis2Client.on('subscribe',function(channel,num,a){
   console.log('> Redis subscribe channel "' + channel + ':' + num + '" !');
})

redis2Client.subscribe(EVENT_SET, EVENT_DEL, EVENT_EXPIRE, EVENT_EXPIRED);

module.exports = {
  redisClient : redisClient
}