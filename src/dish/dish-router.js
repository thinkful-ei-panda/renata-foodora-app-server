const express = require('express');
const xss = require('xss');
const restaurantDishService = require('./dish');
const restaurantDishRouter = express.Router();
const jsonBodyParser = express.json();
const logs = require('../logs');

//XSS TO PROTECT AGAINST SCRIPT ATTACKS
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
  //ADD A DISH
  .post(jsonBodyParser, (req, res, next) => {
    const newDish = {
      restaurant_id: req.body.restaurant_id,
      name: req.body.name,
      price: req.body.price,
      tag_id: req.body.tag_id,
    };

    //VALIDATION WHEN USER USES FIELDS WITH SPACES BEFORE AND AFTER
    //newDish.name = newDish.name.trim().replace(/\s+/g, ' ');

    //VALIDATION FOR NAME AND PRICE [REQUIRED FIELDS]
    for (const field of ['name', 'price'])
      if (!newDish[field]) {
        logs.error(`Dish ${field} is required.`);
        return res
          .status(400)
          .json({ error: `The ${field} field is required.` });
      }

    //CONST CALLING PRICE ERROR VALIDATION
    const priceError = restaurantDishService.priceValidation(newDish.price);
    if (priceError) {
      logs.error(priceError);
      return res
        .status(400)
        .json({ error: priceError });
    }

    //CONST CALLING TAG ERROR VALIDATION
    const tagError = restaurantDishService.tagValidation(req.body.tag_id);
    if (tagError) {
      logs.error(tagError);
      return res
        .status(400)
        .json({ error: tagError });
    }

    //ADDING DISH VALIDATION
    restaurantDishService
      .addDish(req.app.get('db'), newDish)
      .then((dish) => {
        logs.info(`Dish created successfully. The dish id is: ${dish.id}.`);

        req.body.tag_id.forEach((e) => {
          restaurantDishService
            .addTag(req.app.get('db'), dish.id, e)
            .then(() => {
              logs.info('Tags were attached correctly.');
            })
            .catch(next);
        });
        res.status(201)
          .location(`/dish/${dish.id}`)
          .json(serialDish(dish));
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/dish/:id')
  //REQUESTING ALL DISHES FROM ID
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
  //DELETE A DISH WITH ID
  .delete(jsonBodyParser, (req, res, next) => {
    const { id } = req.params;

    //DELETE DISH VALIDATION
    restaurantDishService
      .deleteDish(req.app.get('db'), id)
      .then(() => {
        logs.info(`Dish with id ${id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/dishSearchResults')
  //GET ALL DISHES AND DISPLAY WITH TAGS + REST. INFO
  .get((req, res, next) => {
    const SearchParams = {
      tag: req.query.tag, 
      price: req.query.price,
      name: req.query.name,
    };
    
    //CONST CALLING PRICE VALIDATION
    const priceSearchError = restaurantDishService.searchPriceValidation(SearchParams.price);
    if(priceSearchError){
      logs.error(priceSearchError);
      return res.status(400).json({ error: priceSearchError });
    }
    
    //GETTING ALL DISHES VALIDATION
    restaurantDishService
      .showResult(req.app.get('db'), SearchParams.tag, restaurantDishService.convertPriceToRange(SearchParams.price), SearchParams.name)
      .then((dishes) => {
        logs.info('Request for search results successful.');
        if (!dishes) {
          logs.error('Search result not found.');
          return res.status(404).json({ error: 'Result not found.' });
        }
        res.json(dishes);
        next();
      })
      .catch(next);
  });

restaurantDishRouter
  .route('/tag')
  //GETTING ALL TAGS FROM DB [DISPLAY ON SEARCH, ADD DISH]. READ ONLY.
  .all((req, res, next) => {
    const db = req.app.get('db');
    restaurantDishService
      .getAllTags(db)
      .then((tag) => {
        logs.info('Request all tags successful.');
        res.status(200).json(tag);
      })
      .catch(next);
  });

module.exports = restaurantDishRouter;