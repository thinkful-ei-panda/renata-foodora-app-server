const express = require('express');
const restaurantDish = require('./dish');
const { requireAuth } = require('../middleware/jwt-auth');
const restaurantDishRouter = express.Router();
const bodyParser = express.json();

restaurantDishRouter
  .route('/:restaurant_id')
  .all(requireAuth)
  .get((req, res, next) => {
    const {restaurant_id} = req.params;
    restaurantDish.showAllDishes(req.app.get('db'), restaurant_id)
      .then(restaurant => {
        res.status(200).json(restaurant);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const {restaurant_id, name, price} = req.body
    const newDish = {restaurant_id, name, price};

    if(name == null)
      return res.status(400).json({error: 'Missing Restaurant Name in request body.'});

    restaurantDish.addDish(
      req.app.get('db'),
      newDish
    )
      .then(dish => {
        res.status(201).json(restaurantDish.serialDish(dish));
      })
      .catch(next);
  })
  .delete(bodyParser, (req, res, next) => {
    const { id } = req.body;

    restaurantDish.deleteDish(
      req.app.get('db'),
      id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = restaurantDishRouter;
  