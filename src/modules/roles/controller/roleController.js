const roleService = require('../services/roleService');

const registerRole = async (req, res, next) => {
   try {
      const { roleName, description } = req.body;
      const newRole = await roleService.registerRole(roleName, description);
      res.status(201).json({ message: 'Role Created successfully!', role: newRole });
   } catch (error) {
      next(error);
   }
};

const getRole = async (req, res, next) => {
   try {
      const role = await roleService.getRole();
      res.status(200).json({ success: true, role });
   } catch (error) {
      next(error);
   }
};

const assignRoleToUser = async (req, res, next) => {
   try {
      const { userID } = req.params;
      const { roleID } = req.body;

      if (!roleID) {
         return res.status(400).json({ message: 'roleID is required' });
      }

      const response = await roleService.assignRoleToUser(userID, roleID);
      res.status(201).json(response);
   } catch (error) {
      next(error);
   }
};

const removeRoleFromUser = async (req, res, next) => {
   try {
      const { userId, roleId } = req.params;

      const response = await roleService.removeRoleFromUser(userId, roleId);
      res.status(200).json(response);
   } catch (error) {
      next(error);
   }
};

// permission

const createPermission = async (req, res, next) => {
   try {
      const { permissionName, description } = req.body;

      const response = await roleService.createPermission(permissionName, description);
      res.status(200).json(response);
   } catch (error) {
      next(error);
   }
};

const getPermission = async (req, res, next) => {
   try {
      const response = await roleService.getRolePermission();
      res.status(200).json(response);
   } catch (error) {
      next(error);
   }
};

const assignPermissionToRole = async (req, res, next) => {
   try {
      const { roleId } = req.params;
      const { permissionId, resourceId } = req.body;

      if (!permissionId) {
         return res.status(400).json({ message: 'Permission ID is required' });
      }

      const response = await roleService.assignPermissionToRole(roleId, permissionId, resourceId);
      res.status(201).json(response);
   } catch (error) {
      next(error);
   }
};

const assignPermissionToUser = async (req, res) => {
   try {
      const { permissionID, userID } = req.body;

      if (!permissionID) {
         return res.status(400).json({ message: 'permissionID is required' });
      }

      const response = await roleService.assignPermissionToTheUser(userID, permissionID);
      res.status(201).json(response);
   } catch (error) {
      console.log('i am error', error);
      next(error);
   }
};

const fetchRoles = async (req, res, next) => {
   try {
      const response = await roleService.fetchUserRoles();
      res.status(201).json(response);
   } catch (error) {
      next(error);
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
   fetchRoles,
};
