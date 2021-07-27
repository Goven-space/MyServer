const Sequelize = require('sequelize')
const db = require('../db')

const Assignments = db.define('Assignments',{
    assignment_id:{type:Sequelize.INTEGER,primaryKey:true,allowNull:false,autoIncrement:true},
    org_id:{type:Sequelize.INTEGER,allowNull:false},
    name:{type:Sequelize.STRING,allowNull:false},
    start_time:{type:Sequelize.DATEONLY ,allowNull:false},
    end_time:{type:Sequelize.DATEONLY ,allowNull:false},
    create_time:{
        type:Sequelize.DATE,
        defaultValue:Date.now()
    }
},{
    underscored:true,
    tableName:'assignments'
})

module.exports = Assignments