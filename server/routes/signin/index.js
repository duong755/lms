/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { UserServices } = require('../../services');

const signinRouter = Router({ mergeParams: true });

/**
 * @type {RequestHandler}
 */
const findUserByUsernameOrEmail = async (req, res, next) => {
  if (req.isUnauthenticated()) {
    const emailOrUsername = req.body.emailOrUsername || req.body.email || req.body.username || '';
    try {
      const apiRes = await UserServices.getUserByEmailOrUsername(emailOrUsername);
      if (apiRes.body.hits.total) {
        res.locals.user = apiRes.body.hits.hits[0]._source;
        next();
      } else {
        throw new Error('Wrong username or password');
      }
    } catch (err) {
      res.status(400).json({
        error: err.message.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)/g, '')
      });
    }
  } else {
    res.status(200).json({
      successful: true,
      warning: 'You have already been authenticated'
    });
  }
};

/**
 * @type {RequestHandler}
 */
const comparePassword = (req, res, next) => {
  const { password } = req.body;
  const { hash_password } = res.locals.user;
  bcrypt.compare(password, hash_password, (err, same) => {
    if (err) {
      res.status(500).json({
        error: err.message
      });
    } else {
      if (same) {
        next();
      } else {
        res.status(400).json({
          error: 'Wrong email/username or password'
        });
      }
    }
  });
};

/**
 * @type {RequestHandler}
 */
const generateToken = (req, res) => {
  const user = res.locals.user;
  delete user.hash_password;

  jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '7d'
    },
    (err, encoded) => {
      if (err) {
        res.status(500).json({
          err: err.message
        });
      } else {
        const expireAt = dayjs()
          .add(7, 'day')
          .toDate();
        res.cookie('access_token', encoded, {
          httpOnly: true,
          sameSite: true,
          path: '/',
          expires: expireAt
        });
        res.status(200).json({
          successful: true,
          token: encoded,
          user: user
        });
      }
    }
  );
};

signinRouter.post('/*', findUserByUsernameOrEmail, comparePassword, generateToken);

module.exports = signinRouter;
