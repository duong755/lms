const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const { cassandraTypes } = require('../../../../models/connector');
const lessonService = require('../../../../services/Lesson');
const canAccessCourse = require('../../../../middlewares/canAccessCourse');

const commentRouter = require('./comment');

const lessonRouter = Router({ mergeParams: true });

/**
 * lesson pagination
 */
lessonRouter.get('/', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const result = await lessonService.getLessonsByTeacherAndCourse(req.params.userId, req.params.courseId, page);
    const lessons = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({ lessons: lessons, total: result.body.hits.total });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

/**
 * create lesson
 */
lessonRouter.post('/', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const title = req.body.title;
  const content = req.body.content;

  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .required(),
    content: Joi.string()
      .trim()
      .required()
  });

  const newLesson = {
    teacherId: teacherId,
    courseId: courseId,
    id: cassandraTypes.TimeUuid.now(),
    title: title,
    content: content
  };

  const validationResult = schema.validate(newLesson, {
    allowUnknown: true
  });

  if (validationResult.error && validationResult.error.details.length) {
    const error = _.reduce(
      validationResult.error.details,
      (result, value) => {
        const key = value.path[0];
        const message = value.message;
        result[key] = message;
        return result;
      },
      {}
    );
    res.status(400).json({ error: error });
    return;
  }

  try {
    const upsertResult = await lessonService.upsertLesson(newLesson, void 0, true);
    if (upsertResult.wasApplied()) {
      res.status(200).json({ successful: 'Create new lesson successfully' });
    } else {
      res.status(500).json({ error: 'Can not create this course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

/**
 * get lesson data
 */
lessonRouter.get('/:lessonId', canAccessCourse, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  try {
    const result = await lessonService.getLessonById(teacherId, courseId, lessonId);
    const lesson = result.body._source;
    if (result.body.found) {
      res.status(200).json({ lesson: lesson });
    } else {
      res.status(404).json({ error: 'Can not find this course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

/**
 * edit lesson
 */
lessonRouter.put('/:lessonId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  try {
    let lesson = await lessonService.getLessonById(teacherId, courseId, lessonId);
    lesson = lesson.body._source;
    const newLesson = {
      teacherId: teacherId,
      courseId: req.params.courseId,
      id: req.params.lessonId,
      content: req.body.content === undefined ? lesson.content : req.body.content,
      title: req.body.title === undefined ? lesson.title : req.body.title
    };
    const updateResult = await lessonService.upsertLesson(
      newLesson,
      ['teacher_id', 'course_id', 'id', 'title', 'content'],
      false
    );
    if (updateResult.wasApplied()) {
      res.status(200).json({
        successful: 'Update lesson successfully'
      });
    } else {
      res.status(500).json({ error: 'Can not update this lesson' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

/**
 * delete lesson
 */
lessonRouter.delete('/:lessonId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  try {
    const deleteResult = await lessonService.removeLesson(teacherId, courseId, lessonId);
    if (deleteResult.wasApplied()) {
      res.status(200).json({ successful: 'Delete lesson successfully' });
    } else {
      res.status(500).json({ error: 'Can not delete this course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

lessonRouter.use('/:lessonId/comment', commentRouter);

module.exports = lessonRouter;
