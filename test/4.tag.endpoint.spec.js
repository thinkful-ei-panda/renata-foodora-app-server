const app = require('../src/app');
const base = require('./base');


describe('{TAG} Tag Validation /tag', function () {

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
  
    describe('GET - All Tags /tag', () =>{
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
  
      //TESTS FOR GET ALL TAGS
      it('responds 200 when gets all tags correctly', () => {
        return supertest(app)
          .get('/tag')
          .expect(200);
      });
    });
  });