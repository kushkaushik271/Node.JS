const express = require('express');
const roleRouter = express.Router();

// user permission
roleRouter.use(require('./assignUserPermission'));

roleRouter.use(require('./createRole'));
roleRouter.use(require('./getRole'));
roleRouter.use(require('./userRoleRoutes'));
roleRouter.use(require('./createUserRole'));

roleRouter.use(require('./fetchRoles'));

// permissions

roleRouter.use(require('./createPermission'));
roleRouter.use(require('./getPermission'));

// role permission
roleRouter.use(require('./createRolePermission'));

module.exports = roleRouter;
