// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Admin = db.define('User', {
  // 主键
  id: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
  // 用户名
  name: {type: Sequelize.STRING(20), allowNull: false},
  // 密码
  password: {type: Sequelize.STRING(36), allowNull: false},
  // 姓名
  full_name: {type: Sequelize.STRING, allowNull: false},
  // 角色
  is_admin: {type: Sequelize.INTEGER, allowNull: false},
}, {
  // 是否支持驼峰
  underscored: true,
  // MySQL数据库表名
  tableName: 'user',
});
// 导出model
module.exports = Admin;