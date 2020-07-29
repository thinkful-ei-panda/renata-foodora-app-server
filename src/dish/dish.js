

const restaurantDish = {
  showAllDishes(db, id){
    return db
      .select(
        'foodora_dish.id',
        'foodora_dish.restaurant_id',
        'foodora_restaurant.restaurant_name',
        'foodora_dish.dish_name',
        'foodora_dish.price',
        'foodora_tag.name'
      )
      .from('foodora_dish')
      .join(
        'foodora_dish',
        'foodora.restaurant.restaurant_name',
        'foodora_tag'
      )
      .where('restaurant_id', id) //finish this line
  },

  addDish(db, newDish){
      return db
      .insert(newDish)
      .into('foodora_dish')
      .returning('*')
      .then(([dish]) => dish) //WHAT SHOULD I PUT HERE? 
  },

  deleteDish(db, dish_id){ //HOW TO DELETE SPECIFICALLY THE ID OF DISH?
    return db('foodora_dish')
    .where('id', dish_id)
    .delete()
  },

  serialDish(){ //WHAT WOULD BE THE PARAM HERE?
    return{
        id:
    };
  },
  
};

// DO I NEED TO PUT ALL THE ITEMS ON THE TABLE? OR CAN I SKIP ONE?

dish_name, price, restaurant_id + name
foodora_dish.id +
foodora_tag.name

module.exports = restaurantDish;