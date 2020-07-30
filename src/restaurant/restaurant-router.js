const express = require('express');
const restValidation = require('./restaurant');
const path = require('path');
const restRouter = express.Router();
const jsonBodyParser = express.json();

restRouter.post('/', jsonBodyParser, (req, res, next) => {
   
  const trimRest = {
    username: req.body.username.replace(/\s/g, ''),
    password: req.body.password,
    name: req.body.name.trim(),
    phone: req.body.phone.replace(/\D/g, ''),
  };

  for (const field of ['username', 'password', 'name', 'phone'])
    if (!trimRest[field])
      return res.status(400).json({ error: `'${field}' is required` });

  const passError = restValidation.passValidation(trimRest.password);
  if (passError) return res
    .status(400)
    .json({ error: passError });

  const phoneError = restValidation.phoneValidation(trimRest.phone);
  if (phoneError) return res
    .status(400)
    .json({ error: phoneError});

  restValidation
    .checkRestLogin(req.app.get('db'), trimRest.username)
    .then((validRest) => {
      if (validRest)
        return res
          .status(400)
          .json({ error: 'Username already exists. Try again.' });

      return restValidation.passHash(trimRest.password).then((hashedPass) => {

        trimRest.password = hashedPass;

        return restValidation
          .addRest(req.app.get('db'), trimRest)
          .then((rest) => {
            res
              .status(201)
              .location(
                path.posix.join(
                  'http://localhost:8080',
                  //TODO'USE THE HEROKU LINK HERE'
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
