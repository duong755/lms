const { Router } = require('express');

const examService = require('../../../../services/Exam');

const examRouter = Router({ mergeParams: true });

/**
 * exam pagination
 */
examRouter.get('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const page = req.query.page || 1;
  try {
    const result = await examService.getExamsByCourse(teacherId, courseId, page);
    const exam = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({
      exam: exam,
      total: result.body.hits.total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam');
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
