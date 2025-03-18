const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  description: { type: String },
});

const PermissionSchema = new mongoose.Schema({
  permissionName: { type: String, required: true, unique: true },
  description: { type: String },
});

const ResourceSchema = new mongoose.Schema({
  resourceName: { type: String, required: true, unique: true },
  description: { type: String },
});

const RolePermissionSchema = new mongoose.Schema({
  roleID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
  permissionID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Permission',
  },
  resourceID: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Resource',
  },
});

const UserPermissionSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  permissionID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Permission',
  },
  resourceID: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Resource',
  },
});

const UserRoleSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  roleID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
});

const Role = mongoose.model('Role', RoleSchema);
const Permission = mongoose.model('Permission', PermissionSchema);
const Resource = mongoose.model('Resource', ResourceSchema);
const RolePermission = mongoose.model('RolePermission', RolePermissionSchema);
const UserRole = mongoose.model('UserRole', UserRoleSchema);
const UserPermission = mongoose.model('UserPermission', UserPermissionSchema);

module.exports = {
  Role,
  Permission,
  Resource,
  RolePermission,
  UserRole,
  UserPermission,
};
