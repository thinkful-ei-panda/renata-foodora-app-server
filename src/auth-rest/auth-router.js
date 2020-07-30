const express = require('express');
const authRestaurant = require('./auth-rest');
const authRouter = express.Router();
const bodyParser = express.json();

authRouter.route('/login').post(bodyParser, (req, res, next) => {
  const {username, password} = req.body;
  const restLogin = {username, password};

  for(const [key, value] of Object.entries(restLogin))
    if(value == null)
      return res
        .status(400)
        .json({error: `Missing '${key}' in request body`});
  //TODO: SHOULD I DO A === OR ==?

  authRestaurant.getRestUsername(req.app.get('db'), restLogin.username)
    .then((dbRest) => {
      if(!dbRest)
        return res
          .status(400)
          .json({ error: 'Incorrect Username or Password'});

      return authRestaurant.compareRestPass(
        restLogin.password,
        dbRest.password
      )
        .then((match) => {
          if(!match)
            return res
              .status(400)
              .json({error:'Incorrect Username or Password'});

          const subject = dbRest.username;
          const payload = {restaurant_id: dbRest.restaurant_id};
          res.send({
            authToken: authRestaurant.createRestJWT(subject, payload),
            restaurant_id: payload.restaurant_id,
          });
        });
    })
    .catch(next);
});

module.exports = authRouter;