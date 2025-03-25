const nock = require('nock');
const request = require('supertest');
//jo jo real me use kiya usse import kro first
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserService = require('../../../user/service/userService');
const redisClient = require('../../../../lib/redisClient');


//jaha jaha se jo real me use kiya bo aaya h usse mock kro 
jest.mock('../../../user/service/userService.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../../lib/redisClient');

const user = {
  userId: 'd549b39b-3878-4bbb-9f4c-5ba5c0064672',
  username: 'testUser',
  useremail: 'test@user.com',
  isEmailVerified: true,
  isActive: true,
  is_verified: true
};

const token = {
  accessToken: 'testaccesstoken',
  refreshToken: 'testrefreshtoken',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('loginUser', () => {
  it.only('should login successfully with valid credentials', async () => {
    const req = { body: { email: 'testUser', password: 'test@12345' } };

    //mock nactual function result
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValueOnce(token.accessToken).mockReturnValueOnce(token.refreshToken);
    UserService.loginUser.mockResolvedValue(req.body);

    redisClient.SET.mockResolvedValue();

    //here intercepts the API request made by supertest and returns a fake response.
    nock('http://localhost:3000')
      .post('/user/login')
      .reply(200, { message: 'Login successful', token });

    //make api call
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