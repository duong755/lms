/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const { UserServices } = require('../services');

/**
 * @type {RequestHandler}
 */
const isUsernameValid = (req, res, next) => {
  if (req.body.username && String(req.body.username).trim()) {
    next();
  } else {
    res.status(400).json({ error: 'Username is invalid' });
  }
};

/**
 * @type {RequestHandler}
 */
const isUsernameUnique = async (req, res, next) => {
  try {
    const userRes = await UserServices.getUserByUsername(req.body.username);
    if (userRes.body.hits.total > 0) {
      res.status(400).json({ error: `Username ${req.body.username} has already been used` });
    } else {
      next();
    }
  } catch (usernameErr) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = {
  isUsernameUnique: isUsernameUnique,
  isUsernameValid: isUsernameValid
};
