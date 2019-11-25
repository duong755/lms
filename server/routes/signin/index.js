const { Router } = require('express');

const signinRouter = Router({ mergeParams: true });

signinRouter.post('/', (req, res) => {
  res.end('/api/signin');
});

module.exports = signinRouter;
