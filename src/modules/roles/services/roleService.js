const User = require("../../user/model/userModel");
const { Role, UserRole, Permission, RolePermission, UserPermission } = require("../model/roles");

const registerRole = async (userRole, description) => {

    const existingRole = await Role.findOne({userRole})
    if (existingRole) {
        throw new Error("Role already exists");
    }

    const newRole = new Role({
        roleName: userRole,
        description
    });

    await newRole.save();

    return newRole;
};

const getRole = async () => {
        return await Role.find()
};


const removeRoleFromUser = async (userId, roleId) => {
    const existingAssignment = await UserRole.findOne({ userID: userId, roleID: roleId });

    if (!existingAssignment) {
        throw new Error("Role assignment not found for this user");
    }

    await UserRole.deleteOne({ userID: userId, roleID: roleId });

    return { message: "Role removed from user successfully!" };
};

const assignRoleToUser = async (userID, roleID) => {
    const roleExists = await Role.findById(roleID);
    if (!roleExists) {
        throw new Error("Role not found");
    }

    const existingAssignment = await UserRole.findOne({ userID, roleID });
    if (existingAssignment) {
        throw new Error("User already has this role assigned");
    }

    const newUserRole = new UserRole({ userID, roleID });
    await newUserRole.save();

    return { message: "Role assigned to user successfully!", newUserRole };
};

const createPermission = async( permissionName , desc) => {
    const permissionExist = await Permission.findOne({permissionName});
    if(permissionExist){
        throw new Error("Permission already exists")
    }

    const newPermission = new Permission({ permissionName, desc });
    await newPermission.save();

    return { message: 'Permission saved Successfully', newPermission }
}

const getRolePermission = async() => {
    const getPermission = await Permission.find();

    return { message: 'Permission fetched Successfully', getPermission }
}

const fetchUserRoles = async() => {
    const getPermission = await UserPermission.find()
    .populate('userID')
    .populate('permissionID');
  
    return { message: 'User Permission fetched Successfully', getPermission }
}

const assignPermissionToRole = async (roleId, permissionId, resourceId) => {

    const existingAssignment = await RolePermission.findOne({ roleID: roleId, permissionID: permissionId, resourceID: resourceId });

    if (existingAssignment) {
        throw new Error("Permission already assigned to this role");
    }

    // Create a new role-permission entry
    const newRolePermission = new RolePermission({
        roleID: roleId,
        permissionID: permissionId,
        resourceID: resourceId || null,
    });

    await newRolePermission.save();

    return { message: "Permission assigned to role successfully!", newRolePermission };
};

const assignPermissionToTheUser = async (userId, permissionID) => {
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new Error("User not found");
    }

    const permissionExists = await Permission.findById(permissionID);
    if (!permissionExists) {
        throw new Error("Permission not found");
    }

    const existingAssignment = await UserPermission.findOne({ userID : userId, permissionID });
    if (existingAssignment) {
        throw new Error("User already has this permission assigned");
    }

    const newUserPermission = new UserPermission({ userID : userId, permissionID });
    await newUserPermission.save();

    return { message: "Permission assigned to user successfully!", newUserPermission };
};


module.exports = { registerRole, getRole, removeRoleFromUser, assignRoleToUser, createPermission, getRolePermission, assignPermissionToRole, assignPermissionToTheUser, fetchUserRoles }