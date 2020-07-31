const express = require('express');
const xss = require('xss');
const restaurantDishService = require('./dish');
//const requireAuth = require('../middleware/jwt-auth');
const restaurantDishRouter = express.Router();
const bodyParser = express.json();
const logs = require('../logs');

const serialDish = (dish) => ({
  id: dish.id,
  name: xss(dish.name),
  price: xss(dish.price),
  phone: xss(dish.phone),
  restname: xss(dish.restaurantname),
  restaurant_id: xss(dish.restaurant_id),
});

restaurantDishRouter
  .route('/dish')
  .get((req, res, next) => {
    const db = req.app.get('db');
    restaurantDishService.getAllDishes(db)
      .then(dish => {
        res
          .json(dish.map(serialDish));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { restaurant_id, name, price } = req.body;
    const newDish = { restaurant_id, name, price };

    if (name === null)
      return res
        .status(400)
        .json({ error: 'Missing Restaurant Name in request body.' });

    restaurantDishService
      .addDish(req.app.get('db'), newDish)
      .then(dish => {
        logs.info(`Dish created with ${dish.id} id.`);
        res
          .status(201)
          .location(`/dish/${dish.id}`)
          .json(serialDish(dish));
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/dish/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    restaurantDishService.getById(req.app.get('db'), id)
      .then(dish => {
        if(!dish){
          logs.error(`Dish with ${id} id not found.`);
          return res
            .status(404)
            .json({error: 'Dish not found.'});
        }
        res.dish = dish;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serialDish(res.dish));
  })
  .delete(bodyParser, (req, res, next) => {
    const { id } = req.params;

    restaurantDishService
      .deleteDish(req.app.get('db'), id)
      .then(() => {
        logs.info(`Dish with ${id} id deleted.`);
        res
          .status(204)
          .end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    //TODO NOT WORKING
    const { price } = req.body;
    const priceUpdate = { price };

    if( Object.keys(priceUpdate).length <1){
      return res
        .status(400)
        .json({ error: 'Update must contain price.'});
    }

    restaurantDishService.updateDish(
      req.app.get('db'),
      req.params.idm,
      priceUpdate
    )
      .then(() => {
        res
          .status(204)
          .end();
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/dishSearchResults')
  //.get((req, res, next) => {
//TODO NOT WORKING
  .get((req, res, next) => {
    //console.log(req.query.restaurant_id);
    const restaurant_id = req.query.restaurant_id;
    restaurantDishService.showAllDishes(
      req.app.get('db'), 
      restaurant_id)
      .then(dishes => {
        //console.log('dishes' + JSON.stringify(dishes));
        if(!dishes){
          logs.error(`Search result with ${restaurant_id} id not found.`);
          return res
            .status(404)
            .json({error: 'Search not found.'});
        }
        //console.log('line 26 - before' + res);
        res.json(dishes);
        //console.log('line 128 - after' + res);
        next();
      })
      //TODO making an array and loop thru dishes
      //TODO call serialdish on each dish and push the result on an array
      .catch(next);
  });
  // .get((req, res) => {
  //   res.json(serialDish(res.dish));
  // });
//req.params('restaurant_id'))
// .then(restaurant => {
//   res
//     .status(200)
//     .json(restaurant);
// })
// .catch(next);
//});

module.exports = restaurantDishRouter;
