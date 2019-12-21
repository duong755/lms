const { Router } = require('express');

const { searchCourses } = require('../../services/Course');

const searchRouter = Router({ mergeParams: true });

searchRouter.all('/', async (req, res) => {
  const { query, topics } = req.query;
  const page = Number(req.query.page) || 1;
  let parsedTopics = [];
  try {
    parsedTopics = JSON.parse(topics);
  } catch {
    parsedTopics = [];
  }
  try {
    const searchRes = await searchCourses(query, parsedTopics, void 0, void 0, page);
    const courses = searchRes.body.hits.hits.map((current) => current._source);
    res.status(200).json({
      courses: courses,
      total: searchRes.body.hits.total
    });
  } catch (searchCourseErr) {
    console.error(searchCourseErr);
    res.status(500).json({
      error: 'An unexpected error occured'
    });
  }
});

module.exports = searchRouter;
