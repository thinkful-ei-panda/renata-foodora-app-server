const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const authRestaurant = {

  getRestUsername(db, username){
    return db('foodora.restaurant')
      .where({ username })
      .first();
  },

  compareRestPass(password, hash){
    return bcrypt.compare(password, hash);
  },

  createRestJWT(subject, payload){
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },
  //   DO I NEED 2 SECRETS? ONE FOR REST ONE FOR USER?

  verifyRestJWT(token){
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: ['HS256'],
    });
  },
};

module.exports = authRestaurant;