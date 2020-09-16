const authRestaurantService = require('../auth-rest/auth-rest');

function requireAuth(req, res, next) {
  const token = req.get('Authorization') || '';

  let bearerToken;

  if (!token.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing Bearer Token.' });
  } else {
    bearerToken = token.slice(7, token.length);
  }

  try {
    const payload = authRestaurantService.verifyRestJWT(bearerToken);

    return authRestaurantService
      .getRestUsername(req.app.get('db'), payload.subject)
      .then((rest) => {
        if (!rest) {
          return res.status(401).json({ error: 'Unauthorized request.' });
        }
        req.rest = rest;
        next();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        next(error);
      });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request.' });
  }
}

module.exports = {
  requireAuth,
};
