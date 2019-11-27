const { Router } = require('express');
const jwt = require('jsonwebtoken');

const { extractFromCookie, extractFromAuthHeaderAsBearerToken } = require('../../helpers/jwtExtractors');

const courseRouter = require('./course');

const userRouter = Router({ mergeParams: true });

/**
 * auth
 */
userRouter.post('/', (req, res) => {
  const token = extractFromCookie(req) || extractFromAuthHeaderAsBearerToken(req);
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (!err) {
      res.clearCookie('access_token');
      res.clearCookie('lmsuser');
      res.json(null);
    } else {
      if (typeof decoded === 'object' && decoded !== null) {
        delete decoded.iat;
        delete decoded.exp;
      }
      res.json(decoded);
    }
  });
});

/**
 * get user data
 */
userRouter.get('/:userId', (req, res) => {
  res.end('/api/user/:userId');
});

/**
 * edit user data
 */
userRouter.put('/:userId', (req, res) => {
  res.end('/api/user/:userId');
});

userRouter.use('/:userId/course', courseRouter);

module.exports = userRouter;
