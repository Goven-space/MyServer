const Sequelize = require('sequelize')
const db = require('../db')

const Work = db.define('Work',{
    id:{type:Sequelize.INTEGER,primaryKey:true,allowNull:false,autoIncrement:true},
    assignment_id:{type:Sequelize.INTEGER,allowNull:false},
    user_id:{type:Sequelize.INTEGER,allowNull:false},
    status:{type:Sequelize.INTEGER},
    student_upload:{type:Sequelize.STRING},
    student_upload_name:{type:Sequelize.STRING},
    teacher_upload:{type:Sequelize.STRING},
    teacher_upload_name:{type:Sequelize.STRING},
    teacher_review:{type:Sequelize.STRING},
    teacher_download_time:{type:Sequelize.DATEONLY },
    commit_time:{type:Sequelize.DATEONLY },
    review_time:{type:Sequelize.DATEONLY }
},{
    underscored:true,
    tableName:'work'
})

module.exports = Work