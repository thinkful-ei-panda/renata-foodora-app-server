const xss = require('xss');
const restaurantDishRouter = require('./dish-router');

const restaurantDish = {
  showAllDishes(db, id) {
    return db
      .select(
        'dish.id',
        'dish.restaurant_id',
        'dish.name',
        'dish.price',
        'restaurant.name as restaurantname',
        'restaurant.phone'
        //'tag.tag'
      )
      .from('dish')
      .join(
        //'dish_has_tag', 'dish.id', '=', 'dish_has_tag.dish_id',
        'restaurant','dish.restaurant_id','restaurant.id'
        //'tag', 'dish_has_tag.tag_id', '=', 'tag.id'
      )
      .where('dish.restaurant_id', id);
    // .orderBy(['dish.name', 'restaurant.name', 'tag.tag']);
  },

  addDish(db, newDish) {
    return db
      .insert(newDish)
      .into('dish')
      .returning('*')
      .then(([dish]) => dish);
  },

  deleteDish(db, dish_id) {
    return db('dish').where('id', dish_id).delete();
  },

  serialDish(dish) {
    return {
      id: dish.id,
      name: xss(dish.name),
      price: xss(dish.price),
      phone: xss(dish.phone),
      restname: xss(dish.restaurantname),
      restaurant_id: xss(dish.restaurant_id),
      //dish_img: dish.dish_img || null,
    };
  },
};

module.exports = restaurantDish;
