const express = require('express');
const authRestaurantService = require('./auth-rest');
const logs = require('../logs');
const authRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

authRouter
  .route('/login')
  .post(jsonBodyParser, (req, res, next) => {
    const restLogin = {
      username: req.body.username, 
      password: req.body.password, 
    };
  
    //VALIDATION FOR REQUIRED FIELDS
    for (const field of ['username', 'password'])
      if(!restLogin[field]){
        logs.error(`Login ${field} is required.`);
        return res
          .status(400)
          .json({ error: `The '${field}' field is required.` });
      }
  
    //CHECKING IF CORRECT USERNAME
    return authRestaurantService
      .getRestUsername(req.app.get('db'), restLogin.username)
      .then((dbRest) => {
        if (!dbRest) {
          logs.error('Incorrect Username.');
          return res.status(400).json({ error: 'Username Invalid.' });
        }
        
        //CHECKING IF CORRECT PASSWORD
        return authRestaurantService
          .compareRestPass(restLogin.password, dbRest.password)
          .then((match) => {
            if (!match) {
              logs.error('Incorrect Password.');
              return res.status(400).json({ error: 'Password Invalid.' });
            }
            
            // JWT AUTH
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
  })

  .put(requireAuth, (req, res) => {
    const sub = req.user.username;
    const payload = {
      id: req.restaurant.id,
      name: req.restaurant.name,
    };
    res.send({
      authToken: authRestaurantService.createRestJWT(sub, payload),
    });
  });

module.exports = authRouter;
