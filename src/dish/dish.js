const restaurantDishService = {
  showAllDishes(db, id) {
    //console.log('id=' + id);
    //TODO
    return db
      .select(
        'd.id',
        'd.restaurant_id',
        'd.name',
        'd.price',
        'r.name as restaurantname',
        'r.phone',
        't.tag'
      )
      .from({d:'dish'})
      .leftJoin({r:'restaurant'}, 'd.restaurant_id', '=', 'r.id')
      .leftJoin({dht:'dish_has_tag'}, 'd.id', '=', 'dht.dish_id')
      .leftJoin({t:'tag'}, 'dht.tag_id', '=', 't.id')
      // .join(
      //   'dish_has_tag', 'dish.id', 'dish_has_tag.dish_id',
      //   'restaurant','dish.restaurant_id','restaurant.id',
      //   'tag', 'dish_has_tag.tag_id', 'tag.id'
      // )
      //TODO DONT UNCOMMENT WHERE
//      .where('d.restaurant_id', id)
      .then(results => {
        return results.reduce((result, unflatDish) => {
          result[unflatDish.id] = result[unflatDish.id] || {
            ...unflatDish,
            tags: []
          };

          result[unflatDish.id].tags.push(unflatDish.tag);
          return result;
          //   one.dish_id = two.dish_id;
          // }
          // if(!one.tag_id){
          //   one.tag_id = [];
          // }
          // one.tag_id.push(two.)
          // return one;
        }, {});
      });
      //.orderBy(['dish.name', 'restaurant.name', 'tag.tag']);
  },

  addDish(db, newDish) {
    return db
      .insert(newDish)
      .into('dish')
      .returning('*')
      .then(([dish]) => dish);
  },

  getAllDishes(db){
    return db
      .select('*')
      .from('dish');
  },

  getById(db, id) {
    return db
      .select('*')
      .from('dish')
      .where('id', id)
      .first();
  },

  deleteDish(db, id) {
    return db('dish')
      .where({ id })
      .delete();
  },

  updateDish(db, id, price) {
    //console.log('THIS IS ID =' + JSON.stringify(id)); 
    //console.log('THIS IS PRICE =' + JSON.stringify(price));
    return db('dish')
      .where('id', '=', id)
      .update({price: price});  
  }
};

module.exports = restaurantDishService;
