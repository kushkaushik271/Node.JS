const jwt = require("jsonwebtoken");
const { UserRole, RolePermission, UserPermission } = require("../src/modules/roles/model/roles");
const { STATUS_CODES, MESSAGES } = require("../src/constants/constant");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.NO_TOKEN });
  }
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (
    /* eslint-disable no-unused-vars */
    err
  ) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.UNAUTHORIZED_INVALID_TOKEN });
  }
};

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.NO_TOKEN });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
  }
};

const checkAccess = (allowedRoles = [], allowedPermissions = [], allowedResources = []) => {
  return async (req, res, next) => {
    try {
      let hasRoleAccess = false;
      let hasRolePermissionAccess = false;
      let hasUserPermissionAccess = false;
      let hasResourceAccess = false;

      const userRole = await UserRole.findOne({ userID: req.user.userId }).populate("roleID");

      const userPermissionDocs = await UserPermission.find({ userID: req.user.userId }).populate(
        "permissionID resourceID",
      );

      const userPermissions = userPermissionDocs.map((up) => up.permissionID?.permissionName);
      const userResources = userPermissionDocs
        .map((up) => up.resourceID?.resourceName)
        .filter(Boolean);

      // Check Role Access (Only if allowedRoles is provided)
      if (userRole && allowedRoles.length > 0) {
        hasRoleAccess = allowedRoles.includes(userRole.roleID.roleName);
      }

      // Check Direct User Permission Access (Only if allowedPermissions is provided)
      if (allowedPermissions.length > 0) {
        hasUserPermissionAccess = allowedPermissions.some((permission) =>
          userPermissions.includes(permission),
        );
      }

      // Check Direct User Resource Access (Only if allowedResources is provided)
      if (allowedResources.length > 0) {
        hasResourceAccess = allowedResources.some((resource) => userResources.includes(resource));
      }

      // If permissions are required but the user doesn't have any
      if (allowedPermissions.length > 0 && !hasUserPermissionAccess) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          message: "You don't have user permission to access this resource. Contact the admin.",
        });
      }

      // If resources are required but the user doesn't have access
      if (allowedResources.length > 0 && !hasResourceAccess) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          message: "You don't have access to the required resources. Contact the admin.",
        });
      }

      // Role-Permission Check (Only if permissions are provided)
      if (allowedPermissions.length > 0 && userRole) {
        const rolePermissionDocs = await RolePermission.find({
          roleID: userRole.roleID._id,
        }).populate("permissionID resourceID");
        const rolePermissions = rolePermissionDocs.map((rp) => rp.permissionID?.permissionName);
        hasRolePermissionAccess = allowedPermissions.some((permission) =>
          rolePermissions.includes(permission),
        );
      }

      // If role-based permissions are required but the user doesn't have them
      if (allowedPermissions.length > 0 && !hasRolePermissionAccess) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          message: "You don't have role permission to access this resource. Contact the admin.",
        });
      }

      // Grant access if the user has a valid role OR user-specific permission OR resource access
      if (hasRoleAccess || hasUserPermissionAccess || hasResourceAccess) {
        return next();
      }

      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: "Access Denied: You don't have a valid role, permission, or resource access.",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = { verifyToken, verifyRefreshToken, checkAccess };
