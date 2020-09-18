const express = require('express');
const xss = require('xss');
const restValidationService = require('./restaurant');
const path = require('path');
const restRouter = express.Router();
const jsonBodyParser = express.json();
const logs = require('../logs');

//XSS TO PROTECT AGAINST SCRIPT ATTACKS
const serialRest = (rest) => ({
  id: rest.id,
  username: xss(rest.username),
  password: xss(rest.password),
  name: xss(rest.name),
  phone: xss(rest.phone),
});

restRouter
  .route('/register')
  //RESTAURANT REGISTER
  .post(jsonBodyParser, (req, res, next) => {
    const trimRest = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
    };

    //VALIDATION WHEN USER USES FIELDS WITH SPACES BEFORE AND AFTER
    // trimRest.name = trimRest.name.trim().replace(/\s+/g, ' ');
    // trimRest.phone = trimRest.phone.replace(/\D/g, '');
    // trimRest.username = trimRest.username.replace(/\s/g, '');
        
    
    //VALIDATION FOR NAME AND PRICE [REQUIRED FIELDS]
    for (const field of ['username', 'password', 'name', 'phone'])
      if (!trimRest[field]) {
        logs.error(`Restaurant ${field} is required`);
        return res
          .status(400)
          .json({ error: `The ${field} is required.` });
      }

    //CONST CALLING PASSWORD VALIDATION
    const passError = restValidationService.passValidation(trimRest.password);
    if (passError) {
      logs.error(passError);
      return res
        .status(400)
        .json({ error: passError });
    }
    
    //CONST CALLING NAME VALIDATION
    const nameError = restValidationService.nameValidation(trimRest.name);
    if (nameError) {
      logs.error(nameError);
      return res
        .status(400)
        .json({ error: nameError });
    }

    //CONST CALLING PHONE VALIDATION
    const phoneError = restValidationService.phoneValidation(trimRest.phone);
    if (phoneError) {
      logs.error(phoneError);
      return res
        .status(400)
        .json({ error: phoneError });
    }

    //ADDING RESTAURANT VALIDATION
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
                  .status(201)
                  .location(
                    path.posix.join(
                      'https://dry-fjord-49769.herokuapp.com/',
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
  //DELETES A RESTAURANT WITH ID
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
  //UPDATES A RESTAURANT FIELDS OF NAME AND PHONE
  .patch(jsonBodyParser, (req, res, next) => {
    const trimUpdateRest = {
      id: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
    };

    //VALIDATION WHEN USER USES FIELDS WITH SPACES BEFORE AND AFTER
    //trimUpdateRest.name = trimUpdateRest.name.trim().replace(/\s+/g, ' ');
    //trimUpdateRest.phone = trimUpdateRest.phone.replace(/\D/g, '');

    //VALIDATION FOR NAME AND PRICE [REQUIRED FIELDS]
    for (const field of ['name', 'phone'])
      if (!trimUpdateRest[field]) {
        logs.error(`Restaurant ${field} is required`);
        return res
          .status(400)
          .json({ error: `The ${field} is required.` });
      }

    //CONST CALLING NAME VALIDATION
    const nameError = restValidationService.nameValidation(trimUpdateRest.name);
    if(nameError){
      logs.error(nameError);
      return res
        .status(400)
        .json({ error: nameError });
    }
    
    //CONST CALLING PHONE VALIDATION
    const phoneError = restValidationService.phoneValidation(trimUpdateRest.phone);
    if (phoneError) {
      logs.error(phoneError);
      return res
        .status(400)
        .json({ error: phoneError });
    }

    //UPDATE RESTAURANT VALIDATION
    restValidationService
      .updateRestaurant(req.app.get('db'), trimUpdateRest.id, trimUpdateRest.name, trimUpdateRest.phone)
      .then(() => {
        if (trimUpdateRest.name) {
          logs.info(`Restaurant name ${trimUpdateRest.name} was updated successfully.`);
          res.status(204).end();
        }
        if (trimUpdateRest.phone) {
          logs.info(`Restaurant phone ${trimUpdateRest.phone} was updated successfully.`);
          res.status(204).end();
        }
      })
      .catch(err => {
        res.status(409).json({ error: err });
      });
  });

restRouter
  .route('/restaurant-dish-list/:id')
  //GETS DISHES FROM A SPECIFIC REST. ID
  .get((req, res, next) => {
    const { id } = req.params;

    restValidationService
      .showRestaurantDishesByID(req.app.get('db'), id)
      .then((restID) => {
        logs.info(`Returned all dishes from Restaurant ${id} successfully.`);
        res
          .status(200)
          .json(restID);
      })
      .catch(next);
  })
  //DELETES A DISH FROM A SPECIFIC REST. ID
  .delete(jsonBodyParser, (req, res, next) => {
    const dish_id = req.query.dish_id;
    const restaurant_id = req.params.id;

    restValidationService
      .deleteRestaurantDishes(req.app.get('db'), dish_id, restaurant_id)
      .then(() => {
        logs.info(`Dish id ${dish_id} from Restaurant id ${restaurant_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = restRouter;
