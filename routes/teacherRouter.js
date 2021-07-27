const express = require('express')
const router = express.Router()
// 引入Token验证中间件
const verifyMiddleware = require('./middleware/verify')

const multer = require('multer')
const uploadMiddleware = multer()

const Teacher = require('../controllers/teacherCtrl')
const {download} = require('../controllers/studentCtrl')


router.get('/detail',verifyMiddleware.verifyToken,Teacher.getTeacherDetail)
router.post('/createAssignment',Teacher.createAssignment)
router.post('/deleteAssignment',Teacher.deleteAssignment)
router.get('/download',download)
router.post('/review',verifyMiddleware.verifyToken,Teacher.review)
router.post('/upload',verifyMiddleware.verifyToken,uploadMiddleware.single('file'),Teacher.upload)
router.get('/downloadAll',Teacher.downloadAll)


module.exports = router