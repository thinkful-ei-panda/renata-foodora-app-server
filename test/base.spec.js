const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function restaurantTest() {
  return [
    {
      id: 1,
      username: 'rest-test1',
      password: 'restPass1',
      name: 'Restaurant One',
      phone: '222-123-3254',
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

function dishTest(rest) {
  return [
    {
      id: 1,
      name: 'Dish Test 1',
      price: '12',
      restaurant_id: rest[3].id,
    },
    {
      id: 2,
      name: 'Dish Test 2',
      price: '34',
      restaurant_id: rest[2].id,
    },
    {
      id: 3,
      name: 'Dish Test 3',
      price: '78',
      restaurant_id: rest[1].id,
    },
    {
      id: 4,
      name: 'Dish Test 4',
      price: '55',
      restaurant_id: rest[4].id,
    },
    {
      id: 4,
      name: 'Dish Test 4',
      price: '90',
      restaurant_id: rest[5].id,
    },
  ];
}

function tagTest(){
  return[
    {
      id: 1,
      tag: 'firstTag',
    },
    {
      id: 2,
      tag: 'secondTag',
    },
    {
      id: 3,
      tag: 'thirdTag',
    },
    {
      id: 4,
      tag: 'fourthTag',
    },
    {
      id: 5,
      tag: 'fifthTag',
    },
  ];
}

function dishHasTagTest(dish, tag){
  return[
    {
      id: 1,
      dish_id: dish[2].id,
      tag_id: tag[3].id,
    },
    {
      id: 1,
      dish_id: dish[3].id,
      tag_id: tag[4].id,
    },
    {
      id: 1,
      dish_id: dish[4].id,
      tag_id: tag[5].id,
    },
    {
      id: 1,
      dish_id: dish[5].id,
      tag_id: tag[1].id,
    },
    {
      id: 1,
      dish_id: dish[1].id,
      tag_id: tag[2].id,
    },
  ];
}

function concatenate(){
  const restaurant = restaurantTest();
  const dish = dishTest(restaurantTest);
  const tag = tagTest();
  const dishHasTag = dishHasTagTest(dishTest, tagTest); 

  return {restaurant, dish, tag, dishHasTag};

}

function makingDish(dish, dishType){

  const rest_id = dishType
    .find((event) => event.id === dish.restaurant_id);

  return {
    id: dish.id,
    name: dish.name,
    price: dish.price,
    restaurant_id: rest_id.restaurant_id,
  };
}

function addingTagDish(one, two){
//TODO HOW TO GET JUST THE TAG AND DISH ID? TESTING DELAYED UNTIL NEXT WEEK
    const total = two
    .find((event) => event.id === one.dish_id);
    const joinDish = total.dish_id;
    const joinTag = total.tag_id;

    return{
        id: ,
        dish_id: ,
        tag_id: ,
    };
    // INSERT INTO dish_has_tag (dish_id (dish), tag_id (tag))
}

function clearTables(db){
    return db.raw(
        `TRUNCATE
        dish_has_tag,
        tag,
        dish,
        restaurant
        RESTART IDENTITY CASCADE;`
    );
}

function seedRestTable(db, restaurant){
    const prepRest = restaurant
    .map((rest) => ({
        ...rest,
        password: bcrypt.hashSync(rest.password, 1),
    }));
    return db
        .into('restaurant')
        .insert(prepRest)
        .then(() =>
    db.raw(`SELECT setval('restaurant_id_seq', ?)`, [
        restaurant[restaurant.length -1].id,
    ])
    );
}

function seedOtherTables(db, dish, tag, dish_has_tag, restaurant){
    
    return db
        .transaction(async (event) => {
        await seedRestTable(event, restaurant);
        await event.into('tag').insert(tag);
        await event.raw(`SELECT setval('tag_id_seq', ?)`, [
            tag[tag.length -1].id,
        ]);
        await event.into('dish').insert(dish);
        await event.raw(`SELECT setval('dish_id_seq', ?)`, [
            dish[dish.length -1].id,
        ]);
        await event.into('dish_has_tag'),insert(dish_has_tag);
        await event.raw(`SELECT setval('dish_has_tag' , ?)`,[
            dish_has_tag[dish_has_tag.length -1].id,
        ]);
    });
}

function seedMaliciousDish(db, restaurant, dish){
    return seedRestTable(db, restaurant)
    .then(() => db.into('dish').insert(dish));
}

function makeAuthHead(restaurant, secret = process.env.JWT_SECRET){
    const token = jwt.sign({restaurant_id: restaurant.id}, secret, {
        subject: restaurant.username,
        algorithm: 'HS256',
    });
    return `bearer ${token}`;
}

module.exports = {
 restaurantTest,
 dishTest,
 tagTest,
 dishHasTagTest,
 concatenate,
 makingDish,
 addingTagDish,
 clearTables,
 seedRestTable,
 seedOtherTables,
 seedMaliciousDish,
 makeAuthHead,
};