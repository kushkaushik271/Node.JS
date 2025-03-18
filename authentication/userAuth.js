const jwt = require('jsonwebtoken');
const { UserRole, RolePermission, UserPermission } = require('../src/modules/roles/model/roles');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required.' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid refresh token.' });
  }
};

const checkAccess = (allowedRoles = [], allowedPermissions = []) => {
  return async (req, res, next) => {
    try {
      let hasRoleAccess = false;
      let hasRolePermissionAccess = false;
      let hasUserPermissionAccess = false;

      const userRole = await UserRole.findOne({
        userID: req.user.userId,
      }).populate('roleID');

      const userPermissionDocs = await UserPermission.find({
        userID: req.user.userId,
      }).populate('permissionID');

      const userPermissions = userPermissionDocs.map((up) => up.permissionID.permissionName);
      hasUserPermissionAccess = allowedPermissions.some((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasUserPermissionAccess && userPermissionDocs?.length > 0) {
        return res.status(403).json({
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
        }).populate('permissionID');
        const rolePermissions = rolePermissionDocs.map((rp) => rp.permissionID.permissionName);
        hasRolePermissionAccess = allowedPermissions.some((permission) =>
          rolePermissions.includes(permission),
        );
      }

      if (!hasRolePermissionAccess && rolePermissionDocs?.length > 0) {
        return res.status(403).json({
          message: "You don't have role permission to do that. Please contact the admin.",
        });
      }

      if (hasRoleAccess) {
        return next();
      }

      return res.status(403).json({ message: "Access Denied: You don't have a valid Role." });
    } catch (error) {
      console.error(error);
      next(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = { verifyToken, verifyRefreshToken, checkAccess };
