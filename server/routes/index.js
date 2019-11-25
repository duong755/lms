const { Router } = require('express');

const userRouter = require('./user');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const searchRouter = require('./search');
const topicRouter = require('./topic');

const rootAPIRoute = Router({ mergeParams: true });

rootAPIRoute.all('/', (req, res) => {
  res.end('/api');
});

rootAPIRoute.use('/user', userRouter);
rootAPIRoute.use('/signin', signinRouter);
rootAPIRoute.use('/signup', signupRouter);
rootAPIRoute.use('/search', searchRouter);
rootAPIRoute.use('/topic', topicRouter);

module.exports = rootAPIRoute;
