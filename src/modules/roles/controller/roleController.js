const roleService = require("../services/roleService");
const { STATUS_CODES } = require("../../../constants/constant");

const registerRole = async (req, res, next) => {
  try {
    const { roleName, description } = req.body;
    const newRole = await roleService.registerRole(roleName, description);
    res.status(STATUS_CODES.CREATED).json({ message: "Role Created successfully!", role: newRole });
  } catch (error) {
    next(error);
  }
};

const getRole = async (req, res, next) => {
  try {
    const role = await roleService.getRole();
    res.status(STATUS_CODES.SUCCESS).json({ success: true, role });
  } catch (error) {
    next(error);
  }
};

const assignRoleToUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const { roleID } = req.body;

    if (!roleID) {
      return res.status(400).json({ message: "roleID is required" });
    }

    const response = await roleService.assignRoleToUser(userID, roleID);
    res.status(STATUS_CODES.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

const removeRoleFromUser = async (req, res, next) => {
  try {
    const { userId, roleId } = req.params;

    const response = await roleService.removeRoleFromUser(userId, roleId);
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

// permission

const createPermission = async (req, res, next) => {
  try {
    const { permissionName, description } = req.body;

    const response = await roleService.createPermission(permissionName, description);
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const createResources = async (req, res, next) => {
  try {
    const { resourceName, description } = req.body;

    const response = await roleService.addResource(resourceName, description);
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const getPermission = async (req, res, next) => {
  try {
    const response = await roleService.getRolePermission();
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const getResources = async (req, res, next) => {
  try {
    const response = await roleService.fetchResources();
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const assignPermissionToRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { permissionId, resourceId } = req.body;

    if (!permissionId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Permission ID is required" });
    }

    const response = await roleService.assignPermissionToRole(roleId, permissionId, resourceId);
    res.status(STATUS_CODES.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

const assignPermissionToUser = async (req, res) => {
  try {
    const { permissionID, userID } = req.body;

    if (!permissionID) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "permissionID is required" });
    }

    const response = await roleService.assignPermissionToTheUser(userID, permissionID);
    res.status(STATUS_CODES.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

const assignPermissionToResource = async (req, res) => {
  try {
    const { userID, resourceID } = req.body;

    const result = await roleService.assignPermissionToTheResource(userID, resourceID);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerRole,
  getRole,
  removeRoleFromUser,
  assignRoleToUser,
  createPermission,
  getPermission,
  assignPermissionToRole,
  assignPermissionToUser,
  createResources,
  getResources,
  assignPermissionToResource,
};
