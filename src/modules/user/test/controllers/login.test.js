const nock = require('nock');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserService = require('../../../user/service/userService');
const redisClient = require('../../../../lib/redisClient');
const User = require('../../../user/model/userModel'); // Import User model

// Mock dependencies
jest.mock('../../../user/service/userService.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../../lib/redisClient');

// Mock User model
jest.mock('../../../user/model/userModel', () => ({
  findOne: jest.fn(async (query) => {
    console.log('🔥 Mocked User.findOne called with:', query);
    return {
      userId: 'd549b39b-3878-4bbb-9f4c-5ba5c0064672',
      email: query.email,
      username: 'testUser',
      isEmailVerified: true,
      isActive: true,
      is_verified: true,
    };
  }),
}));

const token = {
  accessToken: 'testaccesstoken',
  refreshToken: 'testrefreshtoken',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('loginUser', () => {
  it.only('should login successfully with valid credentials', async () => {
      const req = { body: { email: 'test@user.com', password: 'test@12345' } };

      // Mock UserService to trigger findOne
      UserService.loginUser.mockImplementation(async (data) => {
          console.log('🚀 Inside UserService.loginUser, calling User.findOne');
          return await User.findOne({ email: data.email });
      });

      // Mock User.findOne to return a user with a password
      User.findOne.mockImplementation(async (query) => {
          if (query.email === 'test@user.com') {
              return {
                  userId: 'd549b39b-3878-4bbb-9f4c-5ba5c0064672',
                  email: query.email,
                  username: 'testUser',
                  password: await bcrypt.hash('test@12345', 10), // Hash the password for comparison
                  isEmailVerified: true,
                  isActive: true,
                  is_verified: true,
              };
          }
          return null; // Simulate user not found for other emails
      });

      // Mock authentication functions
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValueOnce(token.accessToken).mockReturnValueOnce(token.refreshToken);
      redisClient.SET.mockResolvedValue();

      // Intercept API request
      nock('http://localhost:3000')
          .post('/user/login')
          .reply(200, { message: 'Login successful', token });

      // Make API call
      await request('http://localhost:3000')
          .post('/user/login')
          .send(req.body)
          .expect(200)
          .then((response) => {
              expect(response.body).toHaveProperty('message', 'Login successful');
              expect(response.body).toHaveProperty('token');
          });
  });
});
