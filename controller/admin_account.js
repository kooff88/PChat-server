/**
 * 客户控制层
 */

var Models = require('../config/sequelize')
var redisClient = require('../config/redis').redisClient;
var tokenManager = require('../middleware/tokenManager')
var encode = require('../utils/encode')
var logger = require('../middleware/log4jsLogger').getLogger('access')
var fs = require('fs')
var jwt = require('jsonwebtoken')
var path = require('path')


module.exports = {
  // 登录
  login : function (req,res){
    var mobile = req.body.mobile;
    var password = req.body.password;

    if (!mobile) return res.json({ code: 1, message: '请输入登录账号' })
    if (!password) return res.json({ code: 1, message: '请输入登录密码' })

     Models.admin_account.findOne({
      where: { mobile: mobile },
    }).then(function(admin_account){
      if (admin_account &&admin_account.password !== encode.md5(password))  return res.json({ code: 1, message: '用户名或密码错误' })
      var token = tokenManager.generateToken();
      token = admin_account.id + '@' + token;
      var _password = admin_account.getDataValue('password');
      admin_account.setDataValue('password',null);
      tokenManager.saveToken(admin_account.id,{admin_account:admin_account,token:token}).then(function(result){
        res.json({code:0,data:{token:token,admin_account:admin_account}})
      }).catch(function(err){
        res.json({code: 1,message:'登录失败'})
      })
    }).catch(function (err) {
      res.json({ code: 1, message:'登录失败', errors: err.errors })
    })
  },

  // 创建账户
  create:function (req,res){
    var data = req.body.data;
    if (!data) return res.json({ code: 1, message: '成员数据不存在' })
    data.password = encode.md5(data.password);
    Models.admin_account.create(data).then(function(result){
      res.json({
        code:0,
        data:result.dataValues,
        message:'添加用户成功'
      })
    }).catch(function (err) {
      res.json({ code: 1, message: '成员创建失败', errors: err.errors })
    })
  }
}