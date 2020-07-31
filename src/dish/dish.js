

const restaurantDishService = {
  showAllDishes(db, id) {
    //console.log('id=' + id);
    //TODO
    return db
      .select(
        'dish.id',
        'dish.restaurant_id',
        'dish.name',
        'dish.price',
        'restaurant.name as restaurantname',
        'restaurant.phone',
        'tag.tag'
      )
      .from('dish')
      .join(
        'dish_has_tag', 'dish.id', '=', 'dish_has_tag.dish_id',
        'restaurant','dish.restaurant_id','restaurant.id',
        'tag', 'dish_has_tag.tag_id', '=', 'tag.id'
      )
      .where('dish.restaurant_id', id)
      .orderBy(['dish.name', 'restaurant.name', 'tag.tag']);
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

  updateDish(db, price,  newDish) {
    return db('dish')
      .where((price))
      .update(newDish);
  }
};

module.exports = restaurantDishService;
