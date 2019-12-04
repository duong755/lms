const { Router } = require('express');

const auth = require('../../../middlewares/auth');
const isCourseCreator = require('../../../middlewares/isCourseCreator');
const courseService = require('../../../services/Course');
const userService = require('../../../services/User');

const lessonRouter = require('./lesson');
const memberRouter = require('./member');
const exerciseRouter = require('./exercise');
const examRouter = require('./exam');
const joinRequestRouter = require('./join_request');
const reviewRouter = require('./review');

const courseRouter = Router({ mergeParams: true });

/**
 * course pagination
 */
courseRouter.get('/', auth, async (req, res) => {
  try {
    const userResult = await userService.getUserById(res.locals.user.id);
    if (userResult.body.found) {
      if (userResult.body._source.type === 'teacher') {
        const courseResult = await courseService.getCoursesByTeacher(res.locals.user.id);
        const courses = courseResult.body.hits.hits.map((current) => current._source);
        res.status(200).json({ courses: courses, total: courseResult.body.hits.total });
      } else {
        const courseResult = await courseService.getCoursesByStudent(res.locals.user.id);
        const courses = courseResult.body.hits.hits.map((current) => current._source);
        res.status(200).json({ courses: courses, total: courseResult.body.hits.total});
      }
    } else {
      res.status(500).json({ error: 'Can not find user' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * get course data
 */
courseRouter.get('/:courseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId');
});

/**
 * update course
 */
courseRouter.put('/:courseId', auth, isCourseCreator, async (req, res) => {
  const user = res.locals.user;
  try {
    let course = await courseService.getCourseById(user.id, req.params.courseId);
    course = course.body._source;
    const changeCourse = {
      courseId: req.params.courseId,
      teacherId: res.locals.user.id,
      courseName: req.body.courseName === undefined ? course.course_name : req.body.courseName,
      description: req.body.description === undefined ? course.description : req.body.description,
      archive: req.body.description === undefined ? course.archive : req.body.archive
    };

    const upsertResult = await courseService.upsertCourse(
      changeCourse,
      ['teacher_id', 'id', 'course_name', 'description', 'archive'],
      false
    );

    if (upsertResult.wasApplied()) {
      res.status(200).json({ success: 'update course successfully' });
    } else {
      res.status(500).json({ err: 'Unexpected error occured' });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

/**
 * archive course
 */
courseRouter.delete('/:courseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId');
});

courseRouter.use('/:courseId/lesson', lessonRouter);
courseRouter.use('/:courseId/member', memberRouter);
courseRouter.use('/:courseId/exercise', exerciseRouter);
courseRouter.use('/:courseId/exam', examRouter);
courseRouter.use('/:courseId/join_request', joinRequestRouter);
courseRouter.use('/:courseId/review', reviewRouter);

module.exports = courseRouter;
