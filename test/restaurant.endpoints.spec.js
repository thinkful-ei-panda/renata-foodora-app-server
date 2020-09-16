const bcrypt = require('bcryptjs');
const app = require('../src/app');
const base = require('./base');

describe('Register Restaurant /register', function () {
  let db;

  const restTest = base.restaurantObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => base.clearTables(db));

  afterEach('cleanup', () => base.clearTables(db));

  /**
   * @description Register a restaurant and populate their fields
   **/
  describe('POST /register', () => {
    beforeEach('insert restaurants', () => base.seedRestTables(db, restTest));

    //TESTS FOR REQUIRED FIELDS
    const requiredFields = ['name', 'password', 'username', 'phone'];

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        name: 'Name',
        password: 'Test1!',
        username: 'restaurant',
        phone: '222-222-2222',
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        
        delete registerAttemptBody[field];

        return supertest(app)
          .post('/register')
          .send(registerAttemptBody)
          .expect(400, {
            error: `The ${field} is required.`,
          });
      });
    });

    //TESTS FOR PASSWORD LONGER THAN 6 CHARACTERS
    it('responds 400 \'Password be longer than 6 characters\'', () => {
      const userShortPassword = {
        username: 'rest username',
        password: '1234',
        name: 'test name',
        phone: '222-222-2222',
      };
      return supertest(app)
        .post('/register')
        .send(userShortPassword)
        .expect(400, { error: 'Password needs to be longer than 6 characters.' });
    });

    //TESTS FOR PASSWORD SMALLER THAN 12 CHARACTERS
    it('responds 400 \'Password be less than 12 characters\' when long password', () => {
      const userLongPassword = {
        username: 'test username',
        password: '*'.repeat(20),
        name: 'test name',
        phone: '222-222-2222',
      };
      return supertest(app)
        .post('/register')
        .send(userLongPassword)
        .expect(400, { error: 'Password needs to be shorter than 12 characters.' });
    });

    //TESTS FOR PASSWORD STARTS WITH SPACES
    it('responds 400 error when password starts with spaces', () => {
      const userPasswordStartsSpaces = {
        username: 'test username',
        password: ' 1Aa!2Bb@',
        name: 'test name',
        phone: '222-222-2222',
      };
      return supertest(app)
        .post('/register')
        .send(userPasswordStartsSpaces)
        .expect(400, { error: 'Password must not have empty spaces.' });
    });

    //TESTS FOR PASSWORD ENDS WITH SPACES
    it('responds 400 error when password ends with spaces', () => {
      const userPasswordEndsSpaces = {
        username: 'test username',
        password: '1Aa!2Bb@ ',
        name: 'test name',
        phone: '222-222-2222',
      };
      return supertest(app)
        .post('/register')
        .send(userPasswordEndsSpaces)
        .expect(400, { error: 'Password must not have empty spaces.' });
    });

    //TESTS IF PASSWORD HAS 1 UPPERCASE, 1 LOWERCASE AND 1 NUMBER
    it('responds 400 error when password isn\'t complex enough', () => {
      const userPasswordNotComplex = {
        username: 'test username',
        password: 'AAaabb',
        name: 'test name',
        phone: '222-222-2222',
      };
      return supertest(app)
        .post('/register')
        .send(userPasswordNotComplex)
        .expect(400, { error: 'Password must have at least an uppercase, a lowercase and a number.' });
    });

    //TESTS IF USER ALREADY IN DATABASE
    it('responds 400 \'User username already taken\' when username isn\'t unique', () => {
      const duplicateUser = {
        username: restTest.username,
        password: '11AAaa!!',
        name: 'name',
        phone: '2222222222',
      };
      return supertest(app)
        .post('/register')
        .send(duplicateUser)
        .expect(400, { error: 'Username already exists. Try again.' });
    });

    //TESTS IF NAME IS TOO LONG
    it('responds 400 \'Name is too long\' when name field is too long', () => {
      const longUser = {
        username: 'test112',
        password: '11AAaa!!',
        name: 'Name '.repeat(44),
        phone: '2222222222',
      };
      return supertest(app)
        .post('/register')
        .send(longUser)
        .expect(400, { error: 'Name has too many characters.' });
    });

    //TESTS IF PHONE IS TOO LONG
    it('responds 400 \'Phone is too long\' when phone field isn\'t 10 digits', () => {
      const phoneVal = {
        username: 'test115',
        password: '11AAaa!!',
        name: 'Name',
        phone: '22222222222222222222222222222222222',
      };
      return supertest(app)
        .post('/register')
        .send(phoneVal)
        .expect(400, { error: 'Phone must be 10 digits.' });
    });

    //HAPPY PATH IF PASSED CORRECT CREDENTIALS
    describe('POST for HAPPY PATH - Given a valid user registration /register', () => {
      it('responds 201, serialized user with no password', () => {
        const newRest = {
          username: 'restusername',
          password: '11AAaa!!',
          name: 'testname',
          phone: '2222222222',
        };
        return supertest(app)
          .post('/register')
          .send(newRest)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body.username).to.eql(newRest.username);
            expect(res.body.name).to.eql(newRest.name);
            expect(res.body.phone).to.eql(newRest.phone);
            expect(res.body).to.have.property('password');
            expect(res.headers.location).to.eql(`https:/dry-fjord-49769.herokuapp.com/restaurant/${res.body.id}`);
          });
      });

      it('stores the new user in db with bcrypt password', () => {
        const newUser = {
          email: 'test email',
          password: '11AAaa!!',
          name: 'test name',
          phone: '222-222-2222',
        };
        return supertest(app)
          .post('/register')
          .send(newUser)
          .expect(res =>
            db
              .from('restaurant')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username);
                expect(row.name).to.eql(newUser.name);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
