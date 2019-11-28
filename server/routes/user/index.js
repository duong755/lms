const { Router } = require('express');

const courseRouter = require('./course');

const userRouter = Router({ mergeParams: true });

/**
 * auth user info
 */
userRouter.all('/', (req, res) => {
  res.status(200).json(res.locals.user);
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
