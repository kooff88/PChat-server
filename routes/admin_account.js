/**
 * express 路由定义
 */

var express = require('express');
var router = express.Router();
// var tokenManager = require('../middleware/tokenManager')

/**
 * 引入控制层
 */
var admin_account = require('../controller/admin_account');

/**
 * 用户路由定义
 */

router.post('/api/v1/admin_account/login',admin_account.login)
router.post('/api/v1/admin_account', admin_account.create);

module.exports = router;

