const app = require('../src/app');
const base = require('./base');
const jwt = require('jsonwebtoken');

describe('{POST} Test against Restaurant /login', () => {
  let db;

  const restTest = base.restaurantObj();
  
  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean up tables', () => base.clearTables(db));

  afterEach('clean up tables', () => base.clearTables(db));

  /**
   * @description LOGIN/AUTH
   **/
  describe('{POST} /login', () => {
    beforeEach('insert restaurant', () => base.seedRestTables(db, restTest));
  
    //TESTING FOR REQUIRED FIELDS
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

    //TESTS FOR INVALID USERNAME
    it('Responds 400 \'Username Invalid\' when bad username', () => {
      const invalidRestName = {
        username: 'user_not',
        password: 'restPass2',
      };
      return supertest(app)
        .post('/login')
        .send(invalidRestName)
        .expect(400, { error: 'Username Invalid.' });
    });

    //TESTS FOR INVALID PASSWORD
    it('Responds 400 \'Password Invalid\' when bad password', () => {
      const invalidPass = {
        username: 'rest-test2',
        password: 'exist',
      };
      return supertest(app)
        .post('/login')
        .send(invalidPass)
        .expect(400, { error: 'Password Invalid.' });
    });
  });
});

describe('{POST} Happy Path /login', () => {
  let db;
  
  const restTest = base.restaurantObj();
    
  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });
  
  after('disconnect from db', () => db.destroy());
  
  before('clean up tables', () => base.clearTables(db));
  
  afterEach('clean up tables', () => base.clearTables(db));
  /**
   * @description LOGIN/AUTH -- HAPPY PATH
   **/
  describe('POST for HAPPY PATH /login', () => {
    beforeEach('insert restaurant', () => base.seedRestTables(db, restTest));

    //HAPPY PATH ON LOGIN IF CREDENTIALS ARE CORRECT = LOGIN  
    it('Responds 200 and JWT auth Token and restaurant ID using secret when valid', () => { 
      const validRestLogin = {
        username: 'rest-test2',
        password: 'restPass2',
      };

      const expectedToken = jwt.sign(
        { restaurant_id: 1 },
        process.env.JWT_SECRET,
        {
          subject: restTest.username,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      );
    
      const expectedID = 1;

      return supertest(app)
        .post('/login')
        .send(validRestLogin)
        .expect(200, {
          authToken: expectedToken,
          restaurant_id: expectedID,
          name: restTest.name,
        });
    });
  });
});
