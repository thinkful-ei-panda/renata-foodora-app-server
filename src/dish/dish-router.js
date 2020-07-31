const express = require('express');
const restaurantDish = require('./dish');
//const requireAuth = require('../middleware/jwt-auth');
const { serialDish } = require('./dish');
const restaurantDishRouter = express.Router();
//const bodyParser = express.json();


restaurantDishRouter
  //.route('/dish')
  //.all(requireAuth)
  // .get('/', (req, res, next) => `{
  //   const db = req.app.get('db');
  //   restaurantDish.showAllDishes(db)
  //     .then(event => {
  //       res.json(event.map(serialDish));
  //     })
  //     .catch(next);
  // });
  .get('/', (req, res, next) => {
    const { restaurant_id } = req.params;
    restaurantDish
      .showAllDishes(req.app.get('db'), req.param('restaurant_id'))
    //TODO showallDishes
      .then(restaurant => {
        res
          .status(200)
          .json(restaurant);
      })
      .catch(next);
  })
// .post('/', bodyParser, (req, res, next) => {
//   //TODO I DONT NEED THE RESTAURANT ID TO BE POPULATED BY BODY. IS IT A 
//   //TODO WAY TO TO WHEN YOU ADD A DISH JUST ADD THE RESTAURANT_ID WITH IT?
//   const { restaurant_id, name, price } = req.body;
//   const newDish = { restaurant_id, name, price };

//   if (name === null)
//     return res
//       .status(400)
//       .json({ error: 'Missing Restaurant Name in request body.' });

//   restaurantDish
//     .addDish(req.app.get('db'), newDish)
//     .then(dish => {
//       res
//         .status(201)
//         .json(restaurantDish.serialDish(dish));
//     })
//     .catch(next);
// })
// .delete(bodyParser, (req, res, next) => {
//   const { id } = req.body;

//   restaurantDish
//     .deleteDish(req.app.get('db'), id)
//     .then(() => {
//       res
//         .status(204)
//         .end();
//     })
//     .catch(next);
// });

module.exports = restaurantDishRouter;
