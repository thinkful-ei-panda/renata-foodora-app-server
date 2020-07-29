const { default: xss } = require("xss");
const xss = require('xss');
const bcrypt = require('bcryptjs');

const validation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/;

const restValidation = {

  passValidation(pass){
    if(pass.length < 6) {
      return 'Password needs to be longer than 6 characters.';
    }
    if(pass.length > 12){
      return 'Password needs to be shorter than 12 characters.';
    }
    if(pass.startsWith(' ') || pass.endsWith(' ')){
      return 'Password must not have empty spaces.';
    }
    if(!validation.test(pass)){
      return 'Password must have a uppercase, lowercase and a number.';
    }
    return null;
  },

  checkRestLogin(db, username){
      return db('foodora_restaurant')
      .where({ username })
      .first()
      .then((rest) => !!rest);
  },

  insertRest(db, newRest){
      return db
      .insert(newRest)
      .into('foodora_restaurant')
      .returning('*')
      .then(([rest]) => rest);
  },
  serialRest(rest){
      return{
          id: rest.id,
          username: xss(rest.username),
          password: xss(rest.password),

      }
  }

//   username, password, restaurant_name, restaurant_address, city, zip, state, phone, url, email
};

module.exports = restValidation;