const app = require('../src/app');
const base = require('./base');

describe('{DISH} Protected Endpoint - Name Required /dish', function () {

  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST - Required Fields - /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });

    //TESTS FOR REQUIRED FIELDS
    const requiredFields = ['name'];

    requiredFields.forEach(field => {
      const dishAttemptBody = {
        name: '',
        restaurant_id: 2,
        price: 22,
        tag_id: [1],
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
    
        delete dishAttemptBody[field];

        return supertest(app)
          .post('/dish')
          .send(dishAttemptBody)
          .expect(400, {
            error: `The ${field} field is required.`,
          });
      });
    });
  });
});

describe('{DISH} Required Fields - Price Required /dish', function () {

  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST - Required Fields - /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });

    //TESTS FOR REQUIRED FIELDS
    const requiredFields = ['price'];

    requiredFields.forEach(field => {
      const dishAttemptBody = {
        name: 'Dish Name',
        restaurant_id: 2,
        price: ''
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        return supertest(app)
          .post('/dish')
          .send(dishAttemptBody)
          .expect(400, {
            error: `The ${field} field is required.`,
          });
      });
    });
  });
});

describe('{DISH} Price Validation - Price must be integer /dish', function () {

  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST - Price Validation - Price must be integer /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });

    //TESTS FOR PRICE VALIDATION
    it('responds 400 error when price is not an integer', () => {
      const priceNotInteger = {
        name: 'Dish Name',
        restaurant_id: 2,
        price: 'hg',
        tag_id: [1],
      };
      return supertest(app)
        .post('/dish')
        .send(priceNotInteger)
        .expect(400, { error: 'Price must be integer.' });
    });
  });
});

describe('{DISH} Protected Endpoint - Smaller than One /dish', function () {

  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST - Price Validation - Smaller than One /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });
          //TESTS FOR PRICE VALIDATION
          it('responds 400 error when price is smaller than 1', () => {
            const priceSmaller = {
              name: 'Dish Name',
              restaurant_id: 2,
              price: -12,
            };
            return supertest(app)
              .post('/dish')
              .send(priceSmaller)
              .expect(400, { error: 'Price can not be smaller than 1.' });
          });
  });
});

describe('{DISH} Price Validation - Bigger Than 100 /dish', function () {

  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST - Price Validation - Bigger Than 100 /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });
    //TESTS FOR PRICE VALIDATION
    it('responds 400 error when price is bigger than 100', () => {
      const priceBigger = {
        name: 'Dish Name',
        restaurant_id: 2,
        price: 200,
        tag_id: [3],
      };
      return supertest(app)
        .post('/dish')
        .send(priceBigger)
        .expect(400, { error: 'Price can not be bigger than 100.' });
    });
  });
});

describe('{DISH} Tag Validation - Less than 1 tag /dish', function () {
  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST - Tag Validation - Less than 1 tag /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });
          //TESTS FOR TAG VALIDATION
          it('responds 400 error when less than one tag is selected', () => {
            const noTag = {
              name: 'Dish Name',
              restaurant_id: 2,
              price: 89,
              tag_id: [],
            };
            return supertest(app)
              .post('/dish')
              .send(noTag)
              .expect(400, { error: 'At least one tag needs to be selected.' });
          });
  });
});

describe('{DISH} - Tag Validation - More than 5 tags /dish', function () { 
  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));
  describe('POST - Tag Validation - More than 5 tags /dish', () =>{
    beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }
    });
    
      //TESTS FOR TAG VALIDATION
      it('responds 400 error when more than five tags are selected', () => {
        const upTo5Tags = {
          name: 'Dish Name',
          restaurant_id: 2,
          price: 89,
          tag_id: [2,2,2,2,2,2,2,2,2,2,2],
        };
        return supertest(app)
          .post('/dish')
          .send(upTo5Tags)
          .expect(400, { error: 'Only up to five tags can be selected.' });
      });
  });
});

describe('{DISH} Protected Endpoint - Happy Path /dish', function () {
  let db;

  const restTest = base.restaurantObj();
  const restTag = base.makeTagObj();
  const restDish = base.makeDishObj();
  const restDishHasTag = base.makeDishHasTagObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {

    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('POST for HAPPY PATH - Given a valid restaurant dish data /dish', () => {
     beforeEach('insert restaurants, tag, dishHasTag and dish', async function(){
      try{
      await base.seedTag(db, restTag)
      }
      catch(err){
        console.log('err', err);
      }

      try{
      await base.seedRestTables(db, restTest)
      }
      catch(err){
        console.log('err', err);
      }

      try{
        await base.seedDish(db, restDish)
        }
        catch(err){
          console.log('err', err);
        }

      try{
        await base.seedDishHasTag(db, restDishHasTag)
        }
        catch(err){
          console.log('err', err);
        }
    });

    //TESTS FOR HAPPY PATH ON ADD DISH
    it('responds 201, serialized dish', () => {
      const newDish = {
        name: 'Dish Name',
        restaurant_id: 1,
        price: '22',
        tag_id: [2],
      };
      return supertest(app)
        .post('/dish')
        .send(newDish)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.price).to.eql('22');
          expect(res.body.name).to.eql('Dish Name');
          expect(res.body).to.have.property('restaurant_id');
          expect(res.body).to.have.property('phone');
          expect(res.body).to.have.property('restname');
          expect(res.headers.location).to.eql(`/dish/${res.body.id}`);
        });
    });
  });


});

describe('{GET} - Get all dishes from Restaurant ID /dish/:id', function () { 
  let db;

  const restTest = base.restaurantObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('{GET} - /dish/:id', () =>{
    beforeEach('insert restaurants', () => base.seedRestTables(db, restTest));
    
      //TESTS FOR DISH NOT FOUND
      it('responds 200 \'Dishes from Restaurant ID\' when passed valid credentials', () => {
        return supertest(app)
          .get('/dish/1')
          .expect(200);
      });
  });
});

describe('{DELETE} - Delete a dish from Restaurant ID /dish/:id', function () { 

  let db;

  const restTest = base.restaurantObj();

  before('make knex instance', () => {
    db = base.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  beforeEach('cleanup', () => {
    base.clearTables(db);
  });

  afterEach('cleanup', () => base.clearTables(db));

  describe('{DELETE} /dish/:id', () => {
    beforeEach('insert restaurants', () => base.seedRestTables(db, restTest));

    //TESTS WHEN FIELDS WERE ABLE TO DELETE CORRECTLY
    it('responds 204 \'Restaurant dish was deleted\' when passed valid credentials', () => {
      const deleteRestDish = {
        id: 2,
      };
      return supertest(app)
        .delete('/dish/1')
        .send(deleteRestDish)
        .expect(204);
    });
  });
});

