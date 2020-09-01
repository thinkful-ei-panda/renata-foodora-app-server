const express = require('express');
const authRestaurantService = require('./auth-rest');
const logs = require('../logs');
const authRouter = express.Router();
const bodyParser = express.json();

authRouter
  .route('/login')
  .post(bodyParser, (req, res, next) => {
    const restLogin = {
      username: req.body.username, 
      password: req.body.password, 
    };
    console.log(" ROUTER restLogin", JSON.stringify(restLogin))

    for (const field of ['username', 'password'])
      if(!restLogin[field]){
        logs.error(`Login ${field} is required.`);
        return res
          .status(400)
          .json({ error: `The '${field}' field is required.` });
      }
  
    return authRestaurantService
      .getRestUsername(req.app.get('db'), restLogin.username)
      .then((dbRest) => {
        if (!dbRest) {
          logs.error('Incorrect Username.');
          return res.status(400).json({ error: 'Username Invalid.' });
        }

        return authRestaurantService
          .compareRestPass(restLogin.password, dbRest.password)
          .then((match) => {
            if (!match) {
              logs.error('Incorrect Password.');
              return res.status(400).json({ error: 'Password Invalid.' });
            }

            const subject = dbRest.username;
            const payload = { restaurant_id: dbRest.id };
            return res.send({
              authToken: authRestaurantService.createRestJWT(subject, payload),
              restaurant_id: payload.restaurant_id,
              name: dbRest.name,
            });
          })
          .catch(next);
      })
      .catch(next);
  });

module.exports = authRouter;
