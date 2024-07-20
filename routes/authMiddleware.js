require('dotenv').config();
const jwt = require('jsonwebtoken');
const { hasToken } = require('./jwtBlacklist'); // Import the blacklist module

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  // Check if token is blacklisted
  if (hasToken(token)) {
    return res.status(401).json({ message: 'Token has been invalidated' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
