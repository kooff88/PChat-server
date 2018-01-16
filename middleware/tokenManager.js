/**
 * token 管理中间件
 */

 var redisClient = require('../config/redis').redisClient;
 var JWT = require('jsonwebtoken')

var HALF_HOUR_IN_SEC = 1800;
var ONE_DAY_IN_SEC = 86400;
var ONE_MONTH_IN_SEC = 2592000;

var _now = function (){
  return parseInt(Date.now() / 1000);
}

var _expire_in_one_day = function(){
  return _now() + ONE_DAY_IN_SEC;
}

var _expire_in_one_month = function () {
  return _now() + ONE_MONTH_IN_SEC;
}

exports.verifyToken = function (req,res,next){
  var token = req.body.token || req.query.token || req.header['x-access-token']

  if (!token) return res.send({
    code:401,
    message:'您还没有登录，请先登录'
  })

  var user_id = token.split('@')[0];
  redisClient.get(`smart-token-login-${user_id}`,function(err,value){
    if (err || !value) return res.send({
      code:401,
      message:'您还没有登录，请先登录'
    })
    var _loginData = JSON.parse(value);
    if (token !== _loginData.token) return res.send({
      code:401,
      message:'登录令牌不匹配，请重新登录'
    })


    /**
      * 重新设置token过期时间，默认30分钟
    */ 

    redisClient.expire(`smart-token-login-${user_id}`,HALF_HOUR_IN_SEC)

    next()
  })
}

exports.saveToken = function(token,value,type,expire){
  return new Promise(function(resolve,reject){
    if (token && value){
      if (typeof (value) === 'number') value +='';
      else if (typeof (value) === 'object') value = JSON.stringify(value);

      var key = type ? `smart-token-${type}-${token}` : `smart-token-login-${token}`;
      redisClient.set(key,value,'EX',expire || HALF_HOUR_IN_SEC,function(err,result){
        err ? reject(err) : resolve({key:key, result : result , message: 'Redis 保存成功'})
      });
    }else {
      reject (new Error('token或value不存在'))
    }
  })
}

exports.delToken = function(token,type){
  return new Promise(function(resolve,reject){
    var key = type ? `smart-token-${type}-${token}` : `smart-token-login-${token}`;
    redisClient.del(key,function(err,count){
      err ? reject(err) : resolve(count)
    })
  })
}

exports.HALF_HOUR_IN_SEC = HALF_HOUR_IN_SEC;
exports.ONE_DAY_IN_SEC = ONE_DAY_IN_SEC;
exports.ONE_MONTH_IN_SEC = ONE_MONTH_IN_SEC;