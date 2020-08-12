const knex = require('knex');

const restaurantDishService = {
  showResult(db, tag, priceRange, name) { 
    console.log("showResult -> priceRange", priceRange);
    return (
      db
        .select(
          'd.id',
          'd.name',
          'd.restaurant_id',
          'd.price',
          'r.name as restaurantname',
          'r.phone',
          //knex.raw('ARRAY_AGG(t.id) as tag_ids'),
          knex.raw('ARRAY_AGG(t.tag) as tag_names')
        )
        .from({ dht: 'dish_has_tag' })
        .leftJoin({ t: 'tag' }, 'dht.tag_id', '=', 't.id')
        .leftJoin({ d: 'dish' }, 'd.id', '=', 'dht.dish_id')
        .leftJoin({ r: 'restaurant' }, 'd.restaurant_id', '=', 'r.id')
        .where('d.price', '>=', priceRange.fromPrice)
        .where('d.price', '<=', priceRange.toPrice)
        .groupBy('d.id', 'd.name', 'r.name', 'r.phone')
        //.groupBy('d.id', 'd.name')
        .orderBy('d.name')
        .then((dishes) => dishes)
    );

    //.orderBy(['dish.name', 'restaurant.name', 'tag.tag']);
  },

  addDish(db, newDish) {
    console.log("addDish -> newDish", newDish);
    return db
      .insert(newDish)
      .into('dish')
      .returning('*')
      .then(([dish]) => dish);
  },

  addTag(db, dish_id, tag_id){
    const newDishHasTag = {
      dish_id: dish_id,
      tag_id: tag_id
    };

    return db
      .insert(newDishHasTag)
      .into('dish_has_tag')
      .returning('*')
      .then(([tag]) => tag);
  },

  tagValidation(tag){
    if(tag.length < 1){
      return 'At least one tag needs to be selected.';
    }
    if(tag.length > 5){
      return 'Only five tags can be selected.';
    }
    return null;
  },

  getAllDishes(db) {
    return db
      .select('*')
      .from('dish');
  },

  priceValidation(price) {
    let parseResult = parseInt(price);
    if (isNaN(parseResult)) {
      return 'Price must be integer.';
    }
    if (parseResult < 1) {
      return 'Price can not be smaller than 1.';
    }
    if (parseResult > 100) {
      return 'Price can not be bigger than 100.';
    }
    return null;
  },

  getById(db, id) {
    return db
      .select(
        'd.id',
        'd.restaurant_id',
        'd.name',
        'd.price',
        'r.name as restaurantname',
        'r.phone'
      )
      .from({ d: 'dish' })
      .leftJoin({ r: 'restaurant' }, 'd.restaurant_id', '=', 'r.id')
      .where('d.id', id);
  },

  deleteDish(db, id) {
    return db('dish').where({ id }).delete();
  },

  updateDish(db, id, price) {
    return db('dish').where('id', '=', id).update({ price: price });
  },

  getAllTags(db){
    return db
      .select('*')
      .from('tag')
      .orderBy(['tag.tag']);
  },

  // getPrice(db){
  //   return db
  //   .select('price')
  //   .from('dish')
  //   .orderBy(['dish.price']);
  // },

  searchPriceValidation(price){
    let parseResult = parseInt(price);
    //TODO NEED TO STOP WHEN PRICE= 
    if(price == null){
      return null;
    }
    if(price > 5){
      return 'Invalid price.';
    }
    if(price < 1){
      return 'Invalid price';
    }
    if (isNaN(parseResult)) {
      return 'Price must be integer.';
    }
    return null;
  },

  convertPriceToRange(price){
    let fromPrice = 1;
    let toPrice = 100;
    if(price == null){
      // use defaults
    }
    else if (price == 1) {
      toPrice = 10;
    }
    else if (price == 2) {
      fromPrice = 11; 
      toPrice = 40;
    }
    else if (price == 3){
      fromPrice = 41;
      toPrice =60;
    }
    else if (price == 4){
      fromPrice = 61;
      toPrice = 80;
    }
    else if (price == 5){
      fromPrice = 81;
    } 
    return {
      fromPrice: fromPrice,
      toPrice: toPrice
    };
  },

  // dishResultsModified(db, dishID, name, tag){

  //   return (
  //     db
  //       .select(
  //         'd.id',
  //         'd.name',
  //         'd.restaurant_id',
  //         'd.price',
  //         'r.name as restaurantname',
  //         'r.phone',
  //         knex.raw('ARRAY_AGG(t.id) as tag_ids'),
  //         knex.raw('ARRAY_AGG(t.tag) as tag_names')
  //       )
  //       .from({ dht: 'dish_has_tag' })
  //       .leftJoin({ t: 'tag' }, 'dht.tag_id', '=', 't.id')
  //       .leftJoin({ d: 'dish' }, 'd.id', '=', 'dht.dish_id')
  //       .leftJoin({ r: 'restaurant' }, 'd.restaurant_id', '=', 'r.id')
  //       //.where('d.price', '>=', priceRange.fromPrice)
  //       //.where('d.price', '<=', priceRange.toPrice)
  //       .groupBy('d.id', 'd.name', 'r.name', 'r.phone')
  //       .orderBy('d.name')
  //       .then((dishes) => dishes)
  //   );
  // },
  
};

module.exports = restaurantDishService;



// showResult(db, tag, priceRange, name) {
//   console.log("showResult -> name", name)
//   console.log("showResult -> price", JSON.stringify(priceRange))
 
//     return (
//       db
//         .select(
//           "d.id",
//           "d.restaurant_id",
//           "d.name",
//           "d.price",
//           "r.name as restaurantname",
//           "r.phone",
//           "t.tag"
//         )
//         .from({ d: "dish" })
//         .leftJoin({ r: "restaurant" }, "d.restaurant_id", "=", "r.id")
//         .leftJoin({ dht: "dish_has_tag" }, "d.id", "=", "dht.dish_id")
//         .leftJoin({ t: "tag" }, "dht.tag_id", "=", "t.id")
//         .where('d.price', '>=', priceRange.fromPrice)
//         .where('d.price', '<=', priceRange.toPrice)
//         .then((results) => {
//           return results.reduce((result, unflatDish) => {
//             result[unflatDish.id] = result[unflatDish.id] || {
//               ...unflatDish,
//               tags: [],
//             };

//             result[unflatDish.id].tags.push(unflatDish.tag);
//             return result;
//           }, {});
//         })
//     );