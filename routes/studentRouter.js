var express = require('express');
var router = express.Router();
// const User = require('../controllers/user')
// 引入Token验证中间件
const verifyMiddleware = require('./middleware/verify')

const multer = require('multer')
const uploadMiddleware = multer()

const Student = require('../controllers/studentCtrl')

router.get('/detail',verifyMiddleware.verifyToken,Student.getStudentDetail)
router.post('/upload',verifyMiddleware.verifyToken,uploadMiddleware.single('file'),Student.upload)
router.get('/download',Student.download)

module.exports = router