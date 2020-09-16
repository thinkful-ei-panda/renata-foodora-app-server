const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const authRestaurantService = {
  //CHECKS WITH DB RESTAURANT USERNAME
  getRestUsername(db, username) {
    return db('restaurant')
      .where({ username })
      .first();
  },

  //COMPARES WRITTEN PASS WITH HASH
  compareRestPass(password, hash) {
    return bcrypt.compare(password, hash);
  },

  //JWT AUTH
  createRestJWT(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },

  //CHECKS IF JWT IS CORRECT
  verifyRestJWT(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: ['HS256'],
    });
  },
};

module.exports = authRestaurantService;
