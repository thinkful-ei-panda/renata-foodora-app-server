const express = require('express');
const xss = require('xss');
const restValidationService = require('./restaurant');
const path = require('path');
const restRouter = express.Router();
const jsonBodyParser = express.json();
const logs = require('../logs');

const serialRest = (rest) => ({
  id: rest.id,
  username: xss(rest.username),
  password: xss(rest.password),
  name: xss(rest.name),
  phone: xss(rest.phone),
});

restRouter
  .route('/restaurant')
  .post(jsonBodyParser, (req, res, next) => {
   
    const trimRest = {
      username: req.body.username.replace(/\s/g, ''),
      password: req.body.password,
      name: req.body.name.trim(),
      phone: req.body.phone.replace(/\D/g, ''),
    };

    for (const field of ['username', 'password', 'name', 'phone'])
      if (!trimRest[field]) {
        logs.error(`Restaurant ${field} is required`);
        return res
          .status(400)
          .json({ error: `The ${field} field is required.` });
      }
        
    const passError = restValidationService.passValidation (trimRest.password);
    if (passError) {
      logs.error(passError);
      return res
        .status(400)
        .json({ error: passError});
    }
    
    const phoneError = restValidationService.phoneValidation(trimRest.phone);
    if (phoneError) {
      logs.error(phoneError);
      return res
        .status(400)
        .json({ error: phoneError});
    } 

    restValidationService
      .checkRestLogin(req.app.get('db'), trimRest.username)
      .then((validRest) => {
        if (validRest){
          logs.error('Restaurant username already exists.');
          return res
            .status(400)
            .json({ error: 'Username already exists. Try again.' });
        }
          

        return restValidationService.passHash(trimRest.password).then((hashedPass) => {

          trimRest.password = hashedPass;

          return restValidationService
            .addRest(req.app.get('db'), trimRest)
            .then(rest => {
              logs.info(`Restaurant created successfully. The restaurant id is: ${rest.id}.`);
              res
                .status(201)
                .location(
                  path.posix.join(
                    'http://localhost:8080',
                    //TODO'USE THE HEROKU LINK HERE'
                    `/restaurant/${rest.id}`
                  )
                )
                .json(serialRest(rest));
            });
        });
      })
      .catch(next);
  });

module.exports = restRouter;
