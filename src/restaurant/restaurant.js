const xss = require('xss');
const bcrypt = require('bcryptjs');

const validation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/;

const restValidation = {

  passValidation(password){
    if(password.length < 6) {
      return 'Password needs to be longer than 6 characters.';
    }
    if(password.length > 12){
      return 'Password needs to be shorter than 12 characters.';
    }
    if(password.startsWith(' ') || password.endsWith(' ')){
      return 'Password must not have empty spaces.';
    }
    if(!validation.test(password)){
      return 'Password must have a uppercase, lowercase and a number.';
    }
    return null;
  },

  checkRestLogin(db, username){
    return db('foodora')
      .where({ username })
      .first()
      .then((rest) => !!rest);
  },

  addRest(db, newRest){
    return db
      .insert(newRest)
      .into('foodora')
      .returning('*')
      .then(([rest]) => rest);
  },

  serialRest(rest){
    return{
      id: rest.id,
      username: xss(rest.username),
      password: xss(rest.password),
      name: xss(rest.name),
      phone: xss(rest.phone),
    }; 
  },

  passHash(password){
    return bcrypt.hash(password, 12);
  },
};

module.exports = restValidation;