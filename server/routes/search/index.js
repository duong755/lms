const { Router } = require('express');

const searchRouter = Router({ mergeParams: true });

searchRouter.all('/', (req, res) => {
  res.end('/api/search?q=*');
});

module.exports = searchRouter;
