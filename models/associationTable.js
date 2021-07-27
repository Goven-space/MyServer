const AssignmentsModel = require('../models/assignments')
const OrgsModel = require('../models/orgs')
const OrgStudentModel = require('../models/org-student')
const WorkModel = require('../models/work')
const AdminModel = require('../models/admin')

OrgStudentModel.belongsTo(OrgsModel,{foreignKey:'org_id'})
OrgsModel.hasMany(AssignmentsModel,{foreignKey:'org_id',targetKey:'org_id'})
// OrgStudentModel.belongsTo(StudentsModel,{foreignKey:'user_id',targetKey:'id',as:'students'})
OrgsModel.hasMany(OrgStudentModel, {foreignKey:'org_id', targetKey:'org_id'});
WorkModel.belongsTo(AdminModel,{foreignKey:'user_id'})