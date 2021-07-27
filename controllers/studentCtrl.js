// 引入公共方法
const Common = require ('./common');
// 引入常量
const Constant = require ('../constant/constant');
const { Op } = require("sequelize")
// 引入fs模块，用于操作文件
const fs = require ('fs');
// 引入path模块，用于操作文件路径
const path = require ('path');
// 时间插件
const moment = require('moment')

const AdminModel = require('../models/admin')
const AssignmentsModel = require('../models/assignments')
const OrgsModel = require('../models/orgs')
const WorkModel = require('../models/work')
const OrgStudentModel = require('../models/org-student')

let exportObj = {
    getStudentDetail,
    upload,
    download
  };

module.exports = exportObj




//获取学生页面全部信息
function getStudentDetail(req,res){
    // 定义一个返回对象
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    // 定义一个async任务 
    let tasks = {
        queryUser:(cb)=>{
            AdminModel.findOne({
                attributes:['id','name','full_name','email'],
                where:{id:req.id},
                raw:true
            }).then(tabData => {
                resObj.data = {
                    id:tabData.id,
                    name:tabData.name,
                    full_name:tabData.full_name,
                    email:tabData.email
                }
                cb(null,tabData.id)
            })
        },
        queryOrgAssignment:['queryUser',(result,cb)=>{
            OrgStudentModel.findAll({
                attributes:['org_id'],
                order:[[{model:OrgsModel},{model:AssignmentsModel},'assignment_id']],
                where:{user_id:result.queryUser},
                include:[{
                    model:OrgsModel,
                    attributes:['org_name'],
                    include:[{
                        model:AssignmentsModel,                      
                        attributes:['assignment_id','name','start_time','end_time']
                    }]
                }],
                raw:true
            }).then(tabData => {
                let orgs = []
                let assi_id = []
                let assignments = []
                tabData.forEach((item)=>{
                    orgs.push(item['Org.org_name'])
                    assi_id.push({assignment_id:item['Org.Assignments.assignment_id']})
                    let assi = {}
                    assi.assignment_id = item['Org.Assignments.assignment_id'] 
                    assi.org_id = item['org_id']
                    assi.org_name = item['Org.org_name']
                    assi.name = item['Org.Assignments.name']
                    assi.start_time = item['Org.Assignments.start_time']
                    assi.end_time = item['Org.Assignments.end_time']
                    assignments.push(assi)

                })
                
                // 数组去重
                orgs = Array.from(new Set(orgs))
                resObj.data.orgs = orgs
                cb(null,[assi_id,assignments])
            })    
        }],
        queryWork:['queryOrgAssignment',(result,cb)=>{
            WorkModel.findAll({
                attributes:['id','assignment_id','status','student_upload','student_upload_name','teacher_upload','teacher_upload_name','teacher_review','teacher_download_time','commit_time','review_time'],
                order:[['assignment_id']],
                where:{
                    [Op.and]:[
                        {user_id:result.queryUser},
                        {[Op.or]:result.queryOrgAssignment[0]}
                    ]
                },
                raw:true
            }).then(tabData=>{
                let assignments = result.queryOrgAssignment[1]
                let stats = {uncommitted:0,revising:0,improvable:0,finished:0}
                tabData.forEach((item,index)=>{  
                    Common.statCount(item['status'],stats)                  
                    if(item.status!=null){
                        let work = {}
                        work.id = item['id']
                        work.status = item['status']
                        work.student_upload = item['student_upload']
                        work.student_upload_name = item['student_upload_name']
                        work.teacher_upload = item['teacher_upload']
                        work.teacher_upload_name = item['teacher_upload_name']
                        work.teacher_review = item['teacher_review']
                        work.teacher_download_time = item['teacher_download_time']
                        work.commit_time = item['commit_time']
                        work.review_time = item['review_time'] 
                        assignments[index].work = work 
                    }                 
                })
                resObj.data.assignments = assignments
                resObj.data.stats = stats
                cb(null)
            })
        }]
    }
    Common.autoFn (tasks, res, resObj)
}

// 学生文件上传
function upload(req,res){
    let resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    console.log(req.body)
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.body, ['id'], cb)
        },
        queryWork:['checkParams',(result,cb) => {
            WorkModel.findOne({
                attributes:['id','user_id','assignment_id','status','student_upload','student_upload_name','commit_time'],
                where:{
                    [Op.and]:[
                        {user_id:req.id},
                        {assignment_id:req.body.id}
                    ]
                },
                raw:true
            }).then(tabData => {
                
                cb(null,tabData)
            })
        }],
        
        // 查询方法，依赖校验参数方法
        save: ['queryWork', (result, cb) => {
        // 获取上传文件的扩展名
        let assignment_id = req.body.id
        let user_id = req.id
        let lastIndex = req.file.originalname.lastIndexOf('.');
        let extension = req.file.originalname.substr(lastIndex-1);
        // 使用时间戳+作业id+用户id作为新文件名
        let fileName = `${new Date().getTime()}_${assignment_id}_${user_id+extension}`;
        // 保存文件，用新文件名写入
        // 三个参数
        // 1.文件的绝对路径
        // 2.写入的内容
        // 3.回调函数
        // let student_upload = fileName
        // let student_upload_name = req.file.originalname
        fs.writeFile (path.join (__dirname, '../public/upload/studentUpload/' + fileName), req.file.buffer, (err) => {
          // 保存文件出错
          if (err) {
            cb (Constant.SAVE_FILE_ERROR)
          }else{
            resObj.msg = '文件上传成功' 
            cb (null,fileName)
          }
        })
  
      }],
    //  检查是否曾经提交过
      upDateWork:['save',(result,cb) => {
        //   是否曾经上传过文件
        let work = result.queryWork
        //获取当前日期 yyyy-mmmm-dddd格式
        let current_time =  moment(Date.now()).format('YYYY-MM-DD')
        if(work){
            WorkModel.update({
                'student_upload_name':req.file.originalname,
                'student_upload':result.save,
                'commit_time':current_time
            },{
                where:{
                    id:result.queryWork['id']
                }
            }).then(data => {
                
                cb(null,true)
            })
        }else{
            WorkModel.create({
                assignment_id:req.body.id,
                user_id:req.id,
                status:0,
                student_upload_name:req.file.originalname,
                student_upload:result.save,
                commit_time:current_time
            }).catch(err => {
                // cb(err)
            })
        }
    
        
    }],
    delOldFile:['upDateWork', (result,cb)=>{
        let err = null
        if(result.upDateWork){
            fs.rm(path.join (__dirname, '../public/upload/studentUpload/' + result.queryWork['student_upload']),{ recursive:true },function(err){
                if(err){
                    resObj.errMsg= '旧文件删除失败'
                }
                
            })
        }
            resObj.msg = '文件上传成功'
            resObj.data = result.queryWork['student_upload']
            cb(null,resObj)
        }]
        
    
    }
    // 执行公共方法中的autoFn方法，返回数据
  Common.autoFn (tasks, res, resObj)

}

// 学生/老师文件下载
function download(req,res){
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.query, ['id','type'], cb)
        },
        // 查找文件名
        queryFileName:['checkParams',(result,cb) => {
            // 分学生文件和老师文件
            const upLoadType = {'student':['student_upload','../public/upload/studentUpload/'],
                                'teacher':['teacher_upload','../public/upload/teacherUpload/']}
            let fileName = upLoadType[req.query.type][0]
            let originName = `${upLoadType[req.query.type][0]}_name`
            WorkModel.findOne({
                attributes:[fileName,originName],
                where:{id:req.query.id},
                raw:true
            }).then( tabData => {
                // param(文件名，地址)
                let data = [tabData[fileName],tabData[originName],upLoadType[req.query.type][1]]
                cb(null,data)
            }).catch(err=>{
                cb(Constant.FILE_NOT_EXSIT)
            })
        }],
        send:['queryFileName',(result,cb) => {
            const fileName = result.queryFileName[0]
            const originName = req.query.flag ? null : result.queryFileName[1] 
            console.log(1)
            const url = path.join (__dirname,result.queryFileName[2]+fileName)
            console.log(4)
            res.download(url,originName, err=>{
                if(err){
                    console.log(err)
                    
                }else{
                    console.log('文件发送成功')
                }
            })
        }]
    }
       // 执行公共方法中的autoFn方法，返回数据
       Common.autoFn (tasks)
}