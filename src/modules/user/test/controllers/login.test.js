const express = require('express');
const userRoutes = require('../../routes');

jest.mock('../../service/userService');
jest.mock('../../../../lib/redisClient');
jest.mock('bcrypt');
jest.mock('../../controller/userController.js');
jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Login Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should print on console', () => {
    // eslint-disable-next-line no-console
    console.log('34567890');
  });
  it('should return 200 with login successfull message', async () => {

    const userDetails = {
      userId: '5403ffdb-1ee6-417b-89b5-7df99438c1e8',
      username: 'kushkaushik271',
      useremail: 'test@yopmail.com',
      password: '$2b$10$gExqK1J.bgiT0BK8qcwkO.b3OPEEJMYg4.HcmI2icTeng.9e2RQIm',
      isEmailVerified: true,
      isActive: true,
      created_at: '2025-03-10T10:43:09.973Z',
      updated_at: '2025-03-10T10:43:09.973Z',
      createdBy: null,
      modifiedBy: null,
      is_verified: true,
    };

  });
});