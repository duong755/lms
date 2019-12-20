const { Router } = require('express');

const { auth } = require('../middlewares');
const isAuthenticated = require('../middlewares/isAuthenticated');

const userRouter = require('./user');
const createCourseRouter = require('./create-course');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const signoutRouter = require('./signout');
const searchRouter = require('./search');
const topicRouter = require('./topic');

const rootAPIRoute = Router({ mergeParams: true });

rootAPIRoute.all('/', (req, res) => {
  res.end('/api');
});

rootAPIRoute.use(auth);
rootAPIRoute.use('/user', isAuthenticated, userRouter);
rootAPIRoute.use('/create-course', isAuthenticated, createCourseRouter);
rootAPIRoute.use('/signin', signinRouter);
rootAPIRoute.use('/signup', signupRouter);
rootAPIRoute.use('/signout', signoutRouter);
rootAPIRoute.use('/search', searchRouter);
rootAPIRoute.use('/topic', topicRouter);

module.exports = rootAPIRoute;
