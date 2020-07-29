const xss = require('xss');

const restaurantDish = {
  showAllDishes(db, id){
    return db
      .select(
        'dish.id',
        'dish.restaurant_id',
        'dish.name',
        'dish.price',
        'restaurant.name',
        'restaurant.phone',
        'tag.tag'
      )
      .from('dish')
      .join(
        'dish',
        'restaurant.name',
        'restaurant.phone',
        'tag'
      )
      .where('restaurant_id', id); 
  },

  addDish(db, newDish){
    return db
      .insert(newDish)
      .into('dish')
      .returning('*')
      .then(([dish]) => dish);
  },

  deleteDish(db, dish_id){ 
    return db('dish')
      .where('id', dish_id)
      .delete();
  },

  serialDish(dish){ 
    return{
      id: dish.id,
      name: xss(dish.name),
      price: dish.price,
      restaurant_id: dish.restaurant_id,
      dish_img: dish.dish_img || null
    };
  },
};

module.exports = restaurantDish;