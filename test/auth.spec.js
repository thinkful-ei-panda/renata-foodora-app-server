const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const base = require('./base.spec');
const supertest = require('supertest');

describe('Auth Endpoints', () => {
  let db;

  const { restaurant } = base.concatenate();
  const restTest = restaurant[0];

  before('make Knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());
  before('clean up tables', () => base.clearTables(db));
  afterEach('clean up tables', () => base.clearTables(db));

  describe('POST /auth/login', () => {
    beforeEach('insert restaurant', () => base.seedRestTable(db, restTest));

    const reqFields = ['username', 'password'];

    reqFields.forEach((field) => {
      const loginAttemptBody = {
        username: restTest.username,
        password: restTest.password,
      };
      it(`Responds with 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `'${field}' is required` });
      });
    });
    it('Responds 400 \'Invalid Restaurant username\' when bad username', () => {
      const invalidRestName = {
        username: 'user_not',
        password: 'existy',
      };
      return supertest(app)
        .post('/auth/login')
        .send(invalidRestName)
        .expect(400, { error: 'Invalid Restaurant username' });
    });
    it('Responds 400 \'Invalid Restaurant password\' when bad password', () => {
      const invalidPass = {
        username: restTest.username,
        password: 'existy',
      };
      return supertest(app)
        .post('/auth/login')
        .send(invalidPass)
        .expect(400, { error: 'Invalid Restaurant password' });
    });
    it('Responds 200, JWT auth token and user ID using secret when valid', () => {
      const validRest = {
        username: restTest.username,
        password: restTest.password,
      };
      const expectToken = jwt.sign(
        { restaurant_id: restTest.id },
        process.env.JWT_SECRET,
        {
          subject: restTest.username,
          algorithm: 'HS256',
        }
      );
      const expectID = restTest.id;

      return supertest(app)
        .post('./auth/login')
        .send(validRest)
        .expect(200, {
          token: expectToken,
          restaurant_id: expectID,
        });
    });
  });
});
