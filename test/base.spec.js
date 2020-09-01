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

// function dishTest(rest) {
//   return [
//     {
//       id: 1,
//       name: 'Dish Test 1',
//       price: '12',
//       restaurant_id: rest[3],
//     },
//     {
//       id: 2,
//       name: 'Dish Test 2',
//       price: '34',
//       restaurant_id: rest[2],
//     },
//     {
//       id: 3,
//       name: 'Dish Test 3',
//       price: '78',
//       restaurant_id: rest[1],
//     },
//     {
//       id: 4,
//       name: 'Dish Test 4',
//       price: '55',
//       restaurant_id: rest[4],
//     },
//     {
//       id: 4,
//       name: 'Dish Test 4',
//       price: '90',
//       restaurant_id: rest[5],
//     },
//   ];
// }

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
  //TODO SEEED THE TABLE WITHOUT MODIFYING THE REST. ARGS.  
  restaurant.password = bcrypt.hashSync(restaurant.password, 1);
  return db
    .into('restaurant')
    .insert(restaurant)
    .then(() =>
      db.raw(`SELECT setval('restaurant_id_seq', ?)`, restaurant.id)
    );
}
// function seedOtherTables(db, dish, tag, dish_has_tag, restaurant){
    
//   return db
//       .transaction(async (event) => {
//       // await seedRestTable(event, restaurant);
//       // await event.into('tag').insert(tag);
//       // await event.raw(`SELECT setval('tag_id_seq', ?)`, [
//       //     tag[tag.length -1].id,
//       // ]);
//       await event.into('dish').insert(dish);
//       await event.raw(`SELECT setval('dish_id_seq', ?)`, [
//           dish[dish.length -1].id,
//       ]);
//       // await event.into('dish_has_tag'),insert(dish_has_tag);
//       // await event.raw(`SELECT setval('dish_has_tag' , ?)`,[
//       //     dish_has_tag[dish_has_tag.length -1].id,
//       // ]);
//   });
// }

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
  //dishTest,
  concatenate,
  clearTables,
  seedRestTable,
  //seedOtherTables,
  seedMaliciousDish,
  makeAuthHead,
};