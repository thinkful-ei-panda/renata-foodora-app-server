const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const authUser = {
  getUserEmail(db, email){
    return db('foodora_user')
      .where({ email })
      .first();
  },

  comparePass(password, hash){
    return bcrypt.compare(password, hash);
  },

  createJWT(subject, payload){
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },

  verifyJWT(token){
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = authUser;