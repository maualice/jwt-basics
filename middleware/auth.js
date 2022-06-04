const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    req.user = { id, username };
    next(); // hace que se ejecute el proximo middleware y no se detenga la ejecucion,en este caso seria dashboard
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route'); // si por ejemplo el token expiro
  }
};

module.exports = authenticationMiddleware;
