const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const base = require('./base.spec');
const supertest = require('supertest');

describe('Auth Endpoints', () => {
  let db;

  const restaurant = base.concatenate();
  const restTest = restaurant.name1[0];
  console.log("restTest", JSON.stringify(restTest));

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

  describe('POST /login', () => {
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
          .post('/login')
          .send(loginAttemptBody)
          .expect(400, { error: `The '${field}' field is required.` });
      });
    });
    it('Responds 400 \'Username Invalid\' when bad username', () => {
      const invalidRestName = {
        username: 'user_not',
        password: 'existy',
      };
      return supertest(app)
        .post('/login')
        .send(invalidRestName)
        .expect(400, { error: 'Username Invalid.' });
    });
    it('Responds 400 \'Password Invalid\' when bad password', () => {
      const invalidPass = {
        username: restTest.username,
        password: 'existy',
      };
      return supertest(app)
        .post('/login')
        .send(invalidPass)
        .expect(400, { error: 'Password Invalid.' });
    });

  });
});
