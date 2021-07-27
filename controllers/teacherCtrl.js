const Common = require('./common')
const Constant = require('../constant/constant')
const { Op,fn,col } = require("sequelize")
// 引入async
const async = require('async');
const moment = require('moment')
const fs = require('fs')
// 引入path模块，用于操作文件路径
const path = require ('path');

const AdminModel = require('../models/admin')
const AssignmentsModel = require('../models/assignments')
const OrgsModel = require('../models/orgs')
const WorkModel = require('../models/work')
const OrgStudentModel = require('../models/org-student')



let exportObj = {
    getTeacherDetail,
    createAssignment,
    deleteAssignment,
    review,
    upload,
    downloadAll
  };
module.exports = exportObj

// 获取老师页面信息
function getTeacherDetail(req,res){
    let resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    resObj.data = {}
    const tasks = {
        // 获取班级信息
        queryOrgs:(cb)=>{
            OrgsModel.findAll({
                raw:true
            }).then(tabData => {
                let orgId = []
                resObj.data.orgs = []
                tabData.forEach((item,index)=>{
                    orgId.push({org_id:item['org_id']})
                })
                // param(包含的班级id，全部班级的信息)
                cb(null,[orgId,tabData])
            })
        },
        // 已批改作业的数量
        queryRevisingCount:(cb)=> {
            WorkModel.findAll({
                where:{'status':1},
                attributes:['assignment_id',[fn('COUNT',col('status')),'revising_count']],
                group:'assignment_id',
                raw:true
            }).then(tabData => {
                let revisingCount = {}
                tabData.forEach(item => {
                    revisingCount[item['assignment_id']] = {revising_count:item['revising_count']}
                })
                cb(null,revisingCount)
            })
        },
        // 提交作业的数量
        queryWorkCount:(cb) => {
            WorkModel.findAll({
                attributes:['assignment_id',[fn('COUNT',col('status')),'work_count']],
                group:'assignment_id',
                raw:true
            }).then(tabData => {
                let workCount = {}
                tabData.forEach(item => {
                    workCount[item['assignment_id']] = {work_count:item['work_count']}
                })
                cb(null,workCount)
            })
        },
        // 最新作业提交时间
        queryWorkUpdateTime:(cb) => {
            WorkModel.findAll({
                attributes:['assignment_id',[fn('MAX',col('commit_time')),'work_update_time']],
                group:'assignment_id',
                raw:true
            }).then(tabData => {
                let workUpdateTime = {}
                tabData.forEach(item => {
                    workUpdateTime[item['assignment_id']] = {work_update_time:item['work_update_time']}
                })
                cb(null,workUpdateTime)
            })
        },
        // 班级对应的学生数量
        queryOrgStuCount:['queryOrgs',(result,cb)=>{
            OrgStudentModel.findAll({
                where:{[Op.or]:result.queryOrgs[0]},
                attributes:['org_id',[fn('COUNT',col('user_id')),'student_count']],
                group:'org_id',
                raw:true
            }).then(tabData =>{
                
                let orgs = result.queryOrgs[1]
                resObj.data.orgs = []
                let studentCount = {}
                orgs.forEach((item,index) =>{
                    let org = {}
                    org.id = item['org_id']
                    org.student_count = tabData[index]['student_count']
                    org.full_name = item['org_name']
                    resObj.data.orgs.push(org)
                    studentCount[org.id] = {student_count:org.student_count}
                })

                cb(null,studentCount)
            })
        }],
        
        
        // 获取作业信息
        queryAssignments:['queryRevisingCount','queryOrgStuCount','queryWorkCount','queryWorkUpdateTime',(result,cb)=>{
            AssignmentsModel.findAll({
                order:[['create_time','DESC']],
                 raw:true 
            }).then(tabData => {
                
                //班级数据
                let org = result.queryOrgs[1]
                let student_count = result.queryOrgStuCount
                let revising_count = result.queryRevisingCount
                let work_count = result.queryWorkCount
                let work_update_time = result.queryWorkUpdateTime
                let id = []
                let assignments = []
                tabData.forEach((item,index) => {
                    assignments[index] = {}
                    id.push({assignment_id:item['assignment_id']})
                  assignments[index].assignment_id = item['assignment_id']
                  assignments[index].org_id = item['org_id']
                  assignments[index].org_name = org[item['org_id']-1]['org_name']
                  assignments[index].student_count = student_count[item['org_id']]['student_count']
                  assignments[index].name = item['name']
                  assignments[index].revising_count = revising_count[item['assignment_id']] ? revising_count[item['assignment_id']]['revising_count'] : 0
                  assignments[index].work_count = work_count[item['assignment_id']] ? work_count[item['assignment_id']]['work_count'] :0
                  assignments[index].work_update_time = work_update_time[item['assignment_id']] ? work_update_time[item['assignment_id']]['work_update_time'] : 0
                  assignments[index].start_time = item['start_time']
                  assignments[index].end_time = item['end_time']
                })
                cb(null,[id,assignments])
                
            })
        }],
        //作业提交状态
        queryWork:['queryAssignments',(result,cb) => {
            WorkModel.findAll({
                include:[{
                    model:AdminModel,
                    attributes:['name','full_name']
                }],
                raw:true
            }).then(tabData => {
                let assignments = result.queryAssignments[1]
                let work = {}
                tabData.forEach(item => {
                    if(item['status']!=null){
                        let key = item['assignment_id']
                        let student = {}
                        if(!work[key]){
                            work[key] = []
                        }
                        student.id = item['id']
                        student.user_id = item['user_id']
                        student.user = {}
                        student.user.name = item['User.name']
                        student.user.full_name = item['User.full_name']
                        student.status = item['status']
                        student.student_upload_name = item['student_upload_name']
                        student.teacher_upload_name = item['teacher_upload_name']
                        student.teacher_review = item['teacher_review']
                        student.teacher_download_time = item['teacher_download_time']
                        student.commit_time = item['commit_time']
                        student.review_time = item['review_time']
                        work[key].push(student)
                    }
                })
                assignments.forEach(item => {
                    let assi_id = item['assignment_id']
                    if(work[assi_id]){
                        item.works = work[assi_id]
                    }
                })
                resObj.data.assignments = assignments
                cb(null)
            })
        }]

    }

    Common.autoFn(tasks,res,resObj)
}

// 创建作业
function createAssignment(req,res){
    let resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.body, ['org_id', 'name','start_time','end_time'], cb)
        },
        queryOrgs:(cb)=>{
            OrgsModel.findAll({
                raw:true
            }).then(tabData => {
                cb(null,tabData)
            })
        },
        // 提交作业的数量
        queryWorkCount:(cb) => {
            WorkModel.findAll({
                attributes:['assignment_id',[fn('COUNT',col('status')),'work_count']],
                group:'assignment_id',
                raw:true
            }).then(tabData => {
                cb(null,tabData)
            })
        },
        // 执行添加方法
        add: ['checkParams','queryOrgs','queryWorkCount', (result, cb) => {
        // 使用Sequelize的model的create方法插入
            AssignmentsModel.create({
                org_id :req.body.org_id,
                name : req.body.name,
                start_time : req.body.start_time,
                end_time : req.body.end_time
            }).then((data)=> {
                let org_name = result.queryOrgs
                let work_count = result.queryWorkCount
                data = data.dataValues
                data.work_count = work_count[data['assignments_id']-1] ? work_count[data['assignments_id']-1]['work_count'] :0
                data.org_name = org_name[data['org_id']-1]['org_name']
                resObj.data = data
                cb(null);
            }).catch(function (err) {

            // 错误处理
  
            // 打印错误日志
            console.log(err);
            // 通过async提供的回调，返回数据到下一个async方法
            cb(Constant.DEFAULT_ERROR);
          });

      }]
    }
    // 让async自动控制流程
  async.auto(tasks, function (err,result) {
    if(err){
      // 错误处理

      // 打印错误日志
      console.log (err);
      let result = '失败';
      let msg = '添加失败，出现错误';
      if(err.code === 199){
        // 参数缺少错误
        msg = '添加失败，填写信息不全';
      }
    }
    res.send(resObj)
  })
}

// 删除作业
function deleteAssignment(req,res){
    let resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.body, ['id'], cb)
        },
        // 删除方法，依赖校验参数方法
        removeAssignment: cb => {
        // 使用AssignmentsModel的model中的方法更新
            AssignmentsModel.destroy ({
                where: {
                    assignment_id: req.body.id
                }
            }).then(data => {
                cb(null)
            })
        },
        removeWork: ['removeAssignment',(result,cb)=>{
            WorkModel.destroy({
                where: {
                    assignment_id:req.body.id
                }
            }).then(data => {
                resObj.msg ='删除成功'
                cb(null)
            })
        }]
    }
    Common.autoFn(tasks,res,resObj)
}

// 老师批改
function review(req,res){
    let resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.body, ['status','review','id'], cb)
        },
        updateReview:['checkParams',(result,cb) => {
            WorkModel.update({
                'status':req.body.status,
                'teacher_review':req.body.review,
            },{
                where:{
                    id:req.body.id
                }
            }).then(data => {
                resObj.msg = '批改成功'
                resObj.data = data
                cb(null,resObj)
            }).catch(err=>{
                cb(Constant.DEFAULT_ERROR)
            })
        }]
    }
    Common.autoFn(tasks,res,resObj)
}

// 上传附件
function upload(req,res){
    let resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.body, ['id'], cb)
        },
        queryWork:['checkParams',(result,cb) => {
            WorkModel.findOne({
                attributes:['id','user_id','assignment_id','status','teacher_upload','teacher_upload_name','review_time'],
                where:{
                    id:req.body.id
                },
                raw:true
            }).then(tabData => {
                cb(null,tabData)
            })
        }],
        
        // 查询方法，依赖校验参数方法
        save: ['queryWork', (result, cb) => {
        // 获取上传文件的扩展名
        let id = req.body.id
        let lastIndex = req.file.originalname.lastIndexOf('.');
        let extension = req.file.originalname.substr(lastIndex-1);
        // 使用时间戳+作业id+用户id作为新文件名
        let fileName = `${new Date().getTime()}_id_${id+extension}`;
        // 保存文件，用新文件名写入
        // 三个参数
        // 1.文件的绝对路径
        // 2.写入的内容
        // 3.回调函数
        // let teacher_upload = fileName
        // let teacher_upload_name = req.file.originalname
        fs.writeFile (path.join (__dirname, '../public/upload/teacherUpload/' + fileName), req.file.buffer, (err) => {
          // 保存文件出错
          if (err) {
            cb (Constant.SAVE_FILE_ERROR)
          }else{
              console.log(fileName)
            resObj.msg = '文件上传成功' 
            cb (null,fileName)
          }
        })
  
      }],
    //  检查是否曾经提交过
      updateWork:['save',(result,cb) => {
        //   是否曾经上传过文件
        let work = result.queryWork
        //获取当前日期 yyyy-mmmm-dddd格式
        let current_time =  moment(Date.now()).format('YYYY-MM-DD')
        
            WorkModel.update({
                'teacher_upload_name':req.file.originalname,
                'teacher_upload':result.save,
                'status':1,//更新状态
                'review_time':current_time
            },{
                where:{
                    id:req.body.id
                }
            }).then(data => {
                
                cb(null,true)
            }).catch(err => {
                cb(Constant.DEFAULT_ERROR)
            })
        
    
        
    }],
    delOldFile:['updateWork', (result,cb)=>{
        let err = null
        if(result.upDateWork){
            fs.rm(path.join (__dirname, '../public/upload/teacherUpload/' + result.queryWork['teacher_upload']),{ recursive:true },function(err){
                if(err){
                    resObj.errMsg= '旧文件删除失败'
                }
                
            })
        }
            resObj.msg = '文件上传成功'
            resObj.data = result.queryWork['teacher_upload']
            cb(null,resObj)
        }]
        
    
    }
    // 执行公共方法中的autoFn方法，返回数据
  Common.autoFn (tasks, res, resObj)

}




// 下载当前的作业的全部学生上传文件
function downloadAll(req,res){
    const tasks = {
        checkParams: cb => {
            Common.checkParams(req.query, ['id'], cb)
        },
        // 查找文件名
        queryAllFileName:['checkParams',(result,cb) => {
            
            WorkModel.findAll({
                attributes:['student_upload'],
                where:{assignment_id:req.query.id},
                raw:true
            }).then( tabData => {
                cb(null,tabData)
            }).catch(err=>{
                cb(Constant.FILE_NOT_EXSIT)
            })
        }],
        send:['queryAllFileName',(result,cb) => {
            const fileNames = result.queryAllFileName
            fileNames.forEach(item => {
                console.log(item)
                let url = path.join (__dirname,`../public/upload/studentUpload/${item['student_upload']}`)
                console.log(url)
                res.download(url,null, err=>{
                    if(err){
                        console.log(`${item['student_upload']}文件下载失败`)
                        
                    }else{
                        console.log(`${item['student_upload']}文件下载成功`)
                    }
                })
            })
            cb(null) 
        }]
    }
       // 执行公共方法中的autoFn方法，返回数据
       Common.autoFn (tasks)
}