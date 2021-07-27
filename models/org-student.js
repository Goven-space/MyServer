const Sequelize = require('sequelize')
const db = require('../db')

const orgStudent = db.define('orgStudent',{
    id:{type:Sequelize.INTEGER,primaryKey:true,allowNull:false,autoIncrement:true},
    user_id:{type:Sequelize.INTEGER,allowNull:false},
    org_id:{type:Sequelize.INTEGER,allowNull:false}
},{
    underscored:true,
    tableName:"org_student"
})

module.exports = orgStudent