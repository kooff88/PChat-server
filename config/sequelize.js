/**
 * Sequelize 配置文件
 */

 var Sequelize = require('sequelize')
 var fs = require('fs');
 var path = require('path');
 var config = require('./config.js')
 var Models = {};


 /**
 * 初始化
 */

var sequelize = new Sequelize(
  config.mysql.database,             //数据库名
  config.mysql.user,                 // 用户名
  config.mysql.password,             // 用户密码
  {
    'host' : config.mysql.host,       // 数据库服务器ip
    'dialect' : 'mysql',            // 数据库使用mysql
    'port': config.mysql.port,       // 数据库服务器端口
    'pool' : {
      max : 5,
      min : 0,
      idle : 10000
    },
    "timezone" : '+08:00',
    'define' : {
      'userscored':true,
      "charset" : "utf8mb4",
      "collate" : "utf8mb4_unicode_ci",
      "supportBigNumbers" : true,
      "bigNumberStrings" : true
    },
    "benchmark" : true
  });

/**
 * 导出 sequelize
 */

Models.sequelize = sequelize;

sequelize
  .authenticate()
  .then(function(){
    console.log('> sequelize 连接成功');
  })
  .catch(function(err){
    console.log('> sequelize 链接失败', err);
  })

/**
 * 导入模型，并导出模块
 */

fs.readdirSync(path.resolve(__dirname,'../model'))
  .forEach(function(file) {
    var model = sequelize.import(path.resolve(__dirname,'../model',file));
    Models[model.name] = model;
  })  

module.exports = Models;