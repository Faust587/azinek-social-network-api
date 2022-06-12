const request = require('supertest');
const app = require('../../app');

const {
  connectToMongoose,
  clearCollection,
  disconnectFromMongoose,
} = require('../testUtils');
const { STATUS: { FAIL, SUCCESS } } = require('../../src/constants/Validation');
const { STATUS: { CONFIRMED } } = require('../../src/constants/Status');
const userModel = require('../../src/models/User');
const tokenModel = require('../../src/models/Token');

beforeEach(() => {
  connectToMongoose();
});

afterAll(async () => {
  await clearCollection('users');
  await clearCollection('tokens');
  await disconnectFromMongoose();
});

describe('user API test', () => {
  it('should register user', async () => {
    expect.assertions(1);
    await request(app)
      .post('/user/register/')
      .send({
        email: 'testemail@gmail.com',
        password: '12345678Aa',
        userName: 'Andrey_08',
        fullName: 'Andriy Labatiy',
      });
    const users = await userModel.find({});
    expect(users)
      .toHaveLength(1);
  });

  it('should not register user which already exists', async () => {
    expect.assertions(1);
    await request(app)
      .post('/user/register/')
      .send({
        email: 'testemail@gmail.com',
        password: '12345678Aa',
        userName: 'Andrey08',
        fullName: 'Andriy Labatiy',
      });
    const users = await userModel.find({});
    expect(users).toHaveLength(1);
  });

  it('should not login user with INVITED status', async () => {
    expect.assertions(1);
    const response = await request(app)
      .post('/user/login/')
      .send({
        email: 'testemail@gmail.com',
        password: '12345678Aa',
      });
    expect(response.body).toHaveProperty('status', FAIL);
  });

  it('should login user with CONFIRMED status', async () => {
    expect.assertions(1);
    await userModel.findOneAndUpdate({ email: 'testemail@gmail.com' }, { status: CONFIRMED });
    const response = await request(app)
      .post('/user/login/')
      .send({
        email: 'testemail@gmail.com',
        password: '12345678Aa',
      });
    expect(response.body)
      .toHaveProperty('status', SUCCESS);
  });

  it('should not search user by username without token', async () => {
    expect.assertions(1);
    const users = await userModel.find({});

    const response = await request(app)
      .get(`/user/search/${users[0].userName}`);

    expect(response.status).toBe(403);
  });

  it('should search user by username with token', async () => {
    expect.assertions(1);
    const users = await userModel.find({});
    const token = await tokenModel.findOne({ id: users[0].id });
    const response = await request(app)
      .get(`/user/search/${users[0].userName}`)
      .set({ Authorization: `Bearer ${token.accessToken}` });
    expect(response.body).not.toHaveLength(0);
  });

  it('should not update user info without token', async () => {
    expect.assertions(1);
    const users = await userModel.find({});

    const response = await request(app)
      .post('/user/update/')
      .send({
        id: users[0].id,
        userName: 'newName',
        fullName: 'new fullname',
      });
    expect(response.status).toBe(403);
  });

  it('should update user info', async () => {
    expect.assertions(2);
    const users = await userModel.find({});
    const token = await tokenModel.findOne({ id: users[0].id });

    const response = await request(app)
      .post('/user/update/')
      .set({ Authorization: `Bearer ${token.accessToken}` })
      .send({
        id: users[0].id,
        userName: 'newName',
        fullName: 'new fullName',
      });
    expect(response.body).toHaveProperty('userName', 'newName');
    expect(response.body).toHaveProperty('fullName', 'new fullName');
  });
});
