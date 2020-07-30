const express = require('express');
const restValidation = require('./restaurant');
const path = require('path');
const restRouter = express.Router();
const jsonBodyParser = express.json();

restRouter.post('/', jsonBodyParser, (req, res, next) => {

  const {username, password, name, phone} = req.body;
  for (const field of ['username', 'password', 'name', 'phone'])
    if(!req.body[field])
      return res
        .status(400)
        .json({error:`'${field}' is required`});

  const passError = restValidation.passValidation(password);
  if(passError) return res
    .status(400)
    .json({error: passError});

  restValidation.checkRestLogin(req.app.get('db'), username)
    .then((validRest) => {
      if(validRest)
        return res
          .status(400)
          .json({error: 'Username already exists. Try again.'});

      return restValidation.passHash(password).then((hashedPass) => {
        const newRest = {
          username,
          password: hashedPass,
          name,
          phone,
        };

        return restValidation.addRest(req.app.get('db'), newRest).then((rest) => {
          res
            .status(201)
            .location(
              path.posix.join(
                'USER THE HEROKU LINK HERE',
                `/restaurant/${rest.id}`
              )
            )
            .json(restValidation.serialRest(rest));
        });
      });
    })
    .catch(next);
});

module.exports = restRouter;