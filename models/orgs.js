const Sequelize = require('sequelize')
const db = require('../db')

const Orgs = db.define('Orgs',{
    org_id:{type:Sequelize.INTEGER,primaryKey:true,allowNull:false,autoIncrement:true},
    org_name:{type:Sequelize.STRING,allowNull:false}
},{
    underscored:true,
    tableName:"orgs"
})

module.exports = Orgs