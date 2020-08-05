const express = require('express');
const authRestaurantService = require('./auth-rest');
const logs = require('../logs');
const authRouter = express.Router();
const bodyParser = express.json();

authRouter
  .route('/login')
  .post(bodyParser, (req, res, next) => {
    const {username, password} = req.body;
    const restLogin = {username, password};

    for(const [key, value] of Object.entries(restLogin))
      if(value === null){
        logs.error('Username and/or password is required.');
        return res
          .status(400)
          .json({error: `Missing '${key}' in request body`});
      }
   

    authRestaurantService.getRestUsername(req.app.get('db'), restLogin.username)
      .then((dbRest) => {
        if(!dbRest){
          logs.error('Incorrect Username.');
          return res
            .status(400)
            .json({ error: 'Incorrect Username'});
        }


        return authRestaurantService.compareRestPass(
          restLogin.password,
          dbRest.password
        )
          .then((match) => {
            if(!match){
              logs.error('Incorrect Password.');
              return res
                .status(400)
                .json({error:'Incorrect Password.'});
            }


            const subject = dbRest.username;
            const payload = { restaurant_id: dbRest.id };
            res.send({
              authToken: authRestaurantService.createRestJWT(subject, payload),
              restaurant_id: payload.restaurant_id,
              name: dbRest.name,
            });
          });
      })
      .catch(next);
  });

module.exports = authRouter;