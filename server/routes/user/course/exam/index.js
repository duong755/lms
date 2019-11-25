const { Router } = require('express');

const examRouter = Router({ mergeParams: true });

/**
 * exam pagination
 */
examRouter.get('/', (req, res) => {
  const page = Number(req.query.page);
  console.log(page);
  res.end('/api/user/:userId/course/:courseId/exam');
});

/**
 * create exam
 */
examRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam');
});

/**
 * get exam by id
 */
examRouter.get('/:examId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * submit examwork
 */
examRouter.post('/:examId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * edit exam by id
 */
examRouter.put('/:examId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * delete exam by id
 */
examRouter.delete('/:examId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * exam summary
 */
examRouter.all('/:examId/summary', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId/summary');
});

/**
 * get exam work by student
 */
examRouter.get('/:examId/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId/:studentId');
});

module.exports = examRouter;
