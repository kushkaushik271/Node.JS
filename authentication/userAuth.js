const jwt = require("jsonwebtoken");
const {
  UserRole,
  RolePermission,
  UserPermission,
  Resource,
} = require("../src/modules/roles/model/roles");
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

      let resourceIDs = [];

      // Fetch resource IDs only if allowedResources is provided
      if (allowedResources.length > 0) {
        const resources = await Resource.find({ resourceName: { $in: allowedResources } });
        resourceIDs = resources.map((res) => res._id.toString());

        const userPermissionResources = await UserPermission.find({
          userID: req.user.userId,
          resourceID: { $in: resourceIDs },
        }).populate("permissionID");

        const hasResourceAccess = userPermissionResources.length > 0;

        if (!hasResourceAccess) {
          return res.status(STATUS_CODES.FORBIDDEN).json({
            message: "Access Denied: You don't have permission to access this resource.",
          });
        }
        next();
      }

      const userRole = await UserRole.findOne({
        userID: req.user.userId,
      }).populate("roleID");

      const userPermissionDocs = await UserPermission.find({
        userID: req.user.userId,
      }).populate("permissionID");

      const userPermissions = userPermissionDocs.map((up) => up.permissionID.permissionName);
      hasUserPermissionAccess = allowedPermissions.some((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasUserPermissionAccess && userPermissionDocs?.length > 0) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          message: "You don't have user permission to do that. Please contact the admin.",
        });
      }

      if (userRole && allowedRoles.length > 0) {
        const userRoleName = userRole.roleID.roleName;
        hasRoleAccess = allowedRoles.includes(userRoleName);
      }

      if (hasRoleAccess && hasUserPermissionAccess) {
        return next();
      }

      let rolePermissionDocs;
      if (allowedPermissions.length > 0 && userRole) {
        rolePermissionDocs = await RolePermission.find({
          roleID: userRole.roleID._id,
        }).populate("permissionID");
        const rolePermissions = rolePermissionDocs.map((rp) => rp?.permissionID?.permissionName);
        hasRolePermissionAccess = allowedPermissions.some((permission) =>
          rolePermissions.includes(permission),
        );
      }

      if (!hasRolePermissionAccess && rolePermissionDocs?.length > 0) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
          message: "You don't have role permission to do that. Please contact the admin.",
        });
      }

      if (hasRoleAccess) {
        return next();
      }

      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ message: "Access Denied: You don't have a valid Role." });
    } catch (error) {
      next(error);
      res.status(STATUS_CODES.FORBIDDEN).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };
};

module.exports = { verifyToken, verifyRefreshToken, checkAccess };
