const express = require('express');
const xss = require('xss');
const restValidationService = require('./restaurant');
//const { requireAuth } = require('../middleware/jwt-auth');
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
  .route('/register')
  //.all(requireAuth)
  //TODO If you want you auth later on!!!
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

    const passError = restValidationService.passValidation(trimRest.password);
    if (passError) {
      logs.error(passError);
      return res.status(400).json({ error: passError });
    }

    const phoneError = restValidationService.phoneValidation(trimRest.phone);
    if (phoneError) {
      logs.error(phoneError);
      return res.status(400).json({ error: phoneError });
    }

    restValidationService
      .checkRestLogin(req.app.get('db'), trimRest.username)
      .then((validRest) => {
        if (validRest) {
          logs.error('Restaurant username already exists.');
          return res
            .status(400)
            .json({ error: 'Username already exists. Try again.' });
        }

        return restValidationService
          .passHash(trimRest.password)
          .then((hashedPass) => {
            trimRest.password = hashedPass;

            return restValidationService
              .addRest(req.app.get('db'), trimRest)
              .then((rest) => {
                logs.info(
                  `Restaurant created successfully. The restaurant id is: ${rest.id}.`
                );
                res
                  .status(200)
                  .location(
                    path.posix.join(
                      'http://localhost:8080',
                      //TODO 'USE THE HEROKU LINK HERE'
                      `/restaurant/${rest.id}`
                    )
                  )
                  .json(serialRest(rest));
              });
          });
      })
      .catch(next);
  });

restRouter
  .route('/restaurant/:id')
  .delete(jsonBodyParser, (req, res, next) => {
    const { id } = req.params;

    restValidationService
      .deleteRestaurant(req.app.get('db'), id)
      .then(() => {
        logs.info(`Restaurant with id ${id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const id = req.params.id;
    const name = req.query.name;
    const phone = req.query.phone;
    //TODO NEED TO GET BETTER VALIDATION ON PATCH
    restValidationService
      .updateRestaurant(req.app.get('db'), id, name, phone)
      .then(() => {
        if (name) {
          logs.info(`Restaurant name ${name} was updated successfully.`);
          res.status(204).end();
        }
        if (phone) {
          logs.info(`Restaurant phone ${phone} was updated successfully.`);
          res.status(204).end();
        }
      })
      .catch(next);
  });

module.exports = restRouter;
