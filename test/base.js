const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex');

/**
 * create a knex instance connected to postgresql
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

/**
 * create a knex instance connected to postgresql
 * @returns {object} of restaurant objects
 */
function restaurantObj() {
  return (
    {
      id: 1,
      username: 'rest-test1',
      password: 'restPass1',
      name: 'Restaurant One',
      phone: '222-222-2222',
    }, 
    {
      id: 2,
      username: 'rest-test2',
      password: 'restPass2',
      name: 'Restaurant Two',
      phone: '222-123-3255',
    } 
  );
}

/**
 * create a knex instance connected to postgresql
 * @returns {object} of dish objects
 */
function makeDishObj() {
  return (
    {
      id: 1,
      name: 'The First Dish',
      price: 25,
      restaurant_id: 1,
      tag_id: [1],
    },
    {
      id: 2,
      name: 'The Second Dish',
      price: 56,
      restaurant_id: 2,
      tag_id: [2],
    }
  );
}

/**
 * create a knex instance connected to postgresql
 * @returns {object} of tag array objects
 */
function makeTagObj() {
  return (
    {
      id: 1,
      tag: 'Tag One',
    },
    {
      id: 2,
      tag: 'Tag Two',
    }
  );
}

/**
 * create a knex instance connected to postgresql
 * @returns {object} of tag dish has tag objects
 */
function makeDishHasTagObj() {
  return (
    {
      id: 1,
      dish_id: 1,
      tag_id: 1,
    },
    {
      id: 2,
      dish_id: 2,
      tag_id: 2,
    }
  );
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {String} - tables populated accordantly
 */
function makeFixtures() {
  const testRest = restaurantObj();
  const testDish = makeDishObj();
  const testTag = makeTagObj();
  const testDishWTag = makeDishHasTagObj();

  return { testRest, testDish, testTag, testDishWTag };
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} restaurant - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(rest, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ restaurant_id: rest.id }, secret, {
    subject: rest.username,
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}


/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function clearTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
	dish_has_tag,
	tag,
	dish,
	restaurant
	RESTART IDENTITY CASCADE;`
      )
      .then(() =>
        Promise.all([
          trx.raw('ALTER SEQUENCE dish_has_tag_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE tag_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE dish_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE restaurant_id_seq minvalue 0 START WITH 1'),
          trx.raw('SELECT setval(\'dish_has_tag_id_seq\', 0)'),
          trx.raw('SELECT setval(\'tag_id_seq\', 0)'),
          trx.raw('SELECT setval(\'dish_id_seq\', 0)'),
          trx.raw('SELECT setval(\'restaurant_id_seq\', 0)'),
        ])
      )
  );
}

/**
 * insert rest into db with bcrypt passwords and update sequence
 * @param {knex instance} db
 * @param {array} restaurant - array of rest objects for insertion
 * @returns {Promise} - when rest table seeded
 */

function seedRestTables(db, restaurant) {
  restaurant.password = bcrypt.hashSync(restaurant.password, 1);
  return db
    .into('restaurant')
    .insert(restaurant)
    .then(() => db.raw('SELECT setval(\'restaurant_id_seq\', ?)', restaurant.id));
}


module.exports = {
  makeKnexInstance,
  makeAuthHeader,
  restaurantObj,
  makeDishObj,
  clearTables,
  seedRestTables,
  makeTagObj,
  makeFixtures,
  makeDishHasTagObj,
};
