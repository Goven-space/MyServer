var express = require('express');
var router = express.Router();
const User = require('../controllers/user')
// 引入Token验证中间件
const verifyMiddleware = require('./middleware/verify')

/* GET home page. */
router.post('/login', User.login);
router.post('/refreshToken',verifyMiddleware.verifyToken,User.refreshToken)

module.exports = router;
