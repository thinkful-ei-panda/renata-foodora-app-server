const bcrypt = require('bcryptjs');

const validation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/;

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

  phoneValidation(phone) {
    if (phone.length !== 10) {
      return 'Phone must be 10 digits.';
    }
    return null;
  },

  checkRestLogin(db, username) {
    return db('restaurant')
      .where({ username })
      .first()
      .then((rest) => !!rest);
  },

  addRest(db, newRest) {
    return db
      .insert(newRest)
      .into('restaurant')
      .returning('*')
      .then(([rest]) => rest);
  },

  deleteRestaurant(db, id) {
    return db('restaurant').where({ id }).delete();
  },

  updateRestaurant(db, id, name, phone) {
    return db('restaurant')
      .where('id', '=', id)
      .update({ name: name })
      .update({ phone: phone });
  },

  passHash(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = restValidationService;
