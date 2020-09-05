const bcrypt = require('bcryptjs');

//PASSWORD VALIDATION
const validation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/;

//PASSWORD VALIDATION
const restValidationService = {
  passValidation(password) {
    if (password.length < 6) {
      return 'Password needs to be longer than 6 characters.';
    }
    if (password.length > 12) {
      return 'Password needs to be shorter than 12 characters.';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not have empty spaces.';
    }
    if (!validation.test(password)) {
      return 'Password must have at least an uppercase, a lowercase and a number.';
    }
    return null;
  },

  //PHONE VALIDATION
  phoneValidation(phone) {
    if (phone.length !== 10) {
      return 'Phone must be 10 digits.';
    }
    return null;
  },

  //NAME LENGTH VALIDATION
  nameValidation(name){
    if(name.length > 25){
      return 'Name has too many characters.';
    }
    return null;
  },

  //USED TO SHOW THE NAME OF THE RESTAURANT
  checkRestLogin(db, username) {
    return db('restaurant')
      .where({ username })
      .first()
      .then((rest) => !!rest);
  },

  //REGISTRATION
  addRest(db, newRest) {
    return db
      .insert(newRest)
      .into('restaurant')
      .returning('*')
      .then(([rest]) => rest);
  },

  //DELETE RESTAURANT 
  deleteRestaurant(db, id) {
    return db('restaurant')
      .where({ id })
      .delete();
  },

  //UPDATE REST. INFO: NAME & PHONE
  updateRestaurant(db, id, name, phone) {
    return db('restaurant')
      .where('id', '=', id)
      .update({ name: name })
      .update({ phone: phone });
  },

  //HASHING THE PASS. USING BCRYPT
  passHash(password) {
    return bcrypt.hash(password, 12);
  },

  //DISPLAYS THE DISHES FROM THE LOGGED PAGE OF THAT RESTAURANT
  showRestaurantDishesByID(db, restaurantID){
    return(
      db.raw(
        'select ' +
        'd.id' +
        ', d.name' +
        ', d.price' +
        ', ARRAY_REMOVE(ARRAY_AGG(t.tag), null) as tag_names' +
        ' from dish d' +
        ' left join dish_has_tag dht on d.id=dht.dish_id' +
        ' left join tag t on dht.tag_id=t.id' +
        ' where d.restaurant_id =' + restaurantID +
        ' group by d.id, d.name, d.price' 
      )
        .then((dishes) => dishes.rows)
    );
  },

  //DELETES A DISH FROM THE RESTAURANT LIST
  deleteRestaurantDishes(db, id, restaurant_id) {
    return db
      .from({ d: 'dish'})
      .where('d.id', id)
      .andWhere('d.restaurant_id', restaurant_id)
      .delete();
  },

};

module.exports = restValidationService;
