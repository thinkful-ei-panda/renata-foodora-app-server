const { NODE_ENV } = require('./config');
const logs = require('./logs');

function error(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    logs.error(error.message);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
}

module.exports = error;
