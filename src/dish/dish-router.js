const express = require('express');
const xss = require('xss');
const restaurantDishService = require('./dish');
const restaurantDishRouter = express.Router();
const jsonBodyParser = express.json();
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
    restaurantDishService
      .getAllDishes(db)
      .then((dish) => {
        logs.info('Request for all dishes successful.');
        res.status(201).json(dish.map(serialDish));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newDish = {
      restaurant_id: req.body.restaurant_id,
      name: req.body.name.trim(),
      price: req.body.price,
      //tag_id: req.body.tag_id,
    };

    for (const field of ['name', 'price'])
      if (!newDish[field]) {
        logs.error(`Dish ${field} is required`);
        return res
          .status(400)
          .json({ error: `The ${field} field is required` });
      }

    const priceError = restaurantDishService.priceValidation(newDish.price);
    if (priceError) {
      logs.error(priceError);
      return res.status(400).json({ error: priceError });
    }

    const tagError = restaurantDishService.tagValidation(req.body.tag_id);
    if (tagError) {
      logs.error(tagError);
      return res.status(400).json({ error: tagError });
    }

    restaurantDishService
      .addDish(req.app.get('db'), newDish)
      .then((dish) => {
        logs.info(`Dish created successfully. The dish id is: ${dish.id}.`);

        req.body.tag_id.forEach((e) => {
          restaurantDishService
            .addTag(req.app.get('db'), dish.id, e)
            .then(() => {
              logs.info('Tag was attached correctly');
              res.status(201).json({ error: 'Tag not found.' });
            })
            .catch(next);
        });
        res.status(201).location(`/dish/${dish.id}`).json(serialDish(dish));
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/dish/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    restaurantDishService
      .getById(req.app.get('db'), id)
      .then((dish) => {
        if (!dish) {
          logs.error(`Dish with id ${id} not found.`);
          return res.status(404).json({ error: 'Dish not found.' });
        }
        res.dish = dish;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.dish);
  })
  .delete(jsonBodyParser, (req, res, next) => {
    const { id } = req.params;

    restaurantDishService
      .deleteDish(req.app.get('db'), id)
      .then(() => {
        logs.info(`Dish with id ${id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const id = req.params.id;
    const price = req.query.price;

    restaurantDishService
      .updateDish(req.app.get('db'), id, price)
      .then(() => {
        logs.info(`Dish price [id ${id}] was updated successfully`);
        res.status(204).end();
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/dishSearchResults')
//TODO REMEMBER TO DELETE TAG FROM THE RESULTS HERE
  .get((req, res, next) => {
    const restaurant_id = req.query.restaurant_id;
    restaurantDishService
      .showResult(req.app.get('db'), restaurant_id)
      .then((dishes) => {
        logs.info('Request for search results successful.');
        if (!dishes) {
          logs.error(`Search result with id ${dishes.id} not found.`);
          return res.status(404).json({ error: 'Dish not found.' });
        }
        res.json(dishes);
        next();
      })
      .catch(next);
  });

restaurantDishRouter.route('/tag').all((req, res, next) => {
  const db = req.app.get('db');
  restaurantDishService
    .getAllTags(db)
    .then((tag) => {
      logs.info('Request all tags successful.');
      res.status(201).json(tag);
    })
    .catch(next);
});

module.exports = restaurantDishRouter;
