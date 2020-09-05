const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function restaurantTest() {
  return [
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
    },
    {
      id: 3,
      username: 'rest-test3',
      password: 'restPass3',
      name: 'Restaurant Three',
      phone: '222-123-3274',
    },
    {
      id: 4,
      username: 'rest-test4',
      password: 'restPass4',
      name: 'Restaurant Four',
      phone: '222-123-3574',
    },
    {
      id: 5,
      username: 'rest-test5',
      password: 'restPass5',
      name: 'Restaurant Five',
      phone: '222-163-3274',
    },
  ];
}

function concatenate(){
  const restaurantArray = restaurantTest();
  //const dish = dishTest(restaurantArray);

  return {
    name1: restaurantArray, 
    //name2: dish
  };
}

function clearTables(db){
  return db.raw(
    `TRUNCATE
        dish,
        restaurant
        RESTART IDENTITY CASCADE;`
  );
}

function seedRestTable(db, restaurant){
  restaurant.password = bcrypt.hashSync(restaurant.password, 1);
  return db
    .into('restaurant')
    .insert(restaurant)
    .then(() =>
      db.raw(`SELECT setval('restaurant_id_seq', ?)`, restaurant.id)
    );
}

function seedMaliciousDish(db, restaurant, dish){
  return seedRestTable(db, restaurant)
    .then(() => db.into('dish').insert(dish));
}

function makeAuthHead(restaurant, secret = process.env.JWT_SECRET){
  const token = jwt.sign(
    {
      restaurant_id: restaurant.id
    }, 
    secret, 
    {
      subject: restaurant.username,
      algorithm: 'HS256',
    }
  );
  return `bearer ${token}`;
}

module.exports = {
  restaurantTest,
  concatenate,
  clearTables,
  seedRestTable,
  seedMaliciousDish,
  makeAuthHead,
};