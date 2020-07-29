

const authUser = {
  getUserEmail(db, email){
    return db('foodora_user')
      .where({ email })
      .first();
  },

  comparePass(password, hash){
    return bcrypt.compare(password, hash);
  },

  createJWT(){

  },

  verifyJWT(){

  },




}

module.exports = authUser;