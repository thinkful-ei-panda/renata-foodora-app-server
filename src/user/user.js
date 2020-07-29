const { default: xss } = require("xss");
const xss = require('xss');
const bcrypt = require('bcryptjs');

const validation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/;

const userValidation = {
    
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

  checkUserLogin(db, email){
    return db('foodora_user')
      .where({ email })
      .first()
      .then((user) => !!user);
    //   IS THIS CORRECT TO SAY USER NOT USER? SHOULD IT PRINT A MSG?
    // SINCE EMAIL HAS @ BUT ITS IN A STRING, DOES IT MATTER? DO I HAVE TO DO A SPECIAL CHARACTER?
  },

  insertUser(db, newUser){
    return db
      .insert(newUser)
      .into('foodora_user')
      .returning('*')
      .then(([user]) => user);
  },

  serialUser(user){
    return{
        id: user.id,
        email: xss(user.email),
        password: xss(user.password),

    }
  },
// first_name, last_name, email, user_address, password, zip, city, phone, state

  passEncrypt(pass){
    return bcrypt.hash(pass, 12)
  },

};

module.exports = userValidation;