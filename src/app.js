require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const error = require('./error');

//ROUTES
const restRouter = require('./restaurant/restaurant-router');
const authRouter = require('./auth-rest/auth-router');
const restaurantDishRouter = require('./dish/dish-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(
  morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
  })
);
app.use(helmet());
app.use(cors());

//ROUTES CALL
app.use(restRouter);
app.use(authRouter);
app.use(restaurantDishRouter);

app.use(error);

module.exports = app;
