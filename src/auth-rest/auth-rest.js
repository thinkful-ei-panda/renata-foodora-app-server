const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const authRestaurantService = {
  getRestUsername(db, username) {
    return db('restaurant').where({ username }).first();
  },

  compareRestPass(password, hash) {
    console.log("AUTH REST compareRestPass -> hash", hash);
    console.log("AUTH REST compareRestPass -> password", password);
    return bcrypt.compare(password, hash);
  },

  createRestJWT(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },

  verifyRestJWT(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: ['HS256'],
    });
  },
};

module.exports = authRestaurantService;
