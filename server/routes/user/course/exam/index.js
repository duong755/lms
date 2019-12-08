const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const isCourseMember = require('../../../../middlewares/isCourseMember');
const examWork = require('../../../../services/ExamWork');
const examService = require('../../../../services/Exam');
const { cassandraTypes } = require('../../../../models/connector');

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
examRouter.post('/', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;

  const duration = req.body.duration;
  const title = req.body.title;
  const content = req.body.content;
  const startAt = req.body.startAt;
  const dateTimeParts = startAt.split(' ');
  const timeParts = dateTimeParts[1].split(':');
  const dateParts = dateTimeParts[0].split('-');

  const date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

  const newExam = {
    teacherId: teacherId,
    courseId: courseId,
    examId: cassandraTypes.TimeUuid.now(),
    duration: duration,
    content: content,
    startAt: date.getTime(),
    title: title
  };
  console.log(newExam);
  const schema = Joi.object({
    duration: Joi.string()
      .trim()
      .required(),
    title: Joi.string()
      .trim()
      .required(),
    startAt: Joi.date()
      .timestamp()
      .greater('now')
      .required(),
    content: Joi.array()
      .items(
        Joi.object({
          question: Joi.string()
            .trim()
            .required(),
          choices: Joi.array()
            .items(
              Joi.string()
                .trim()
                .required()
            )
            .unique()
            .required(),
          point: Joi.number().required(),
          answer: Joi.number()
            .min(1)
            .max(4)
            .required()
        }).required()
      )
      .unique()
      .required()
  });

  const validationResult = schema.validate(newExam, {
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
    res.status(400).json({
      error: error
    });
    return;
  }

  try {
    const result = await examService.upsertExam(newExam, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ message: 'Create new exam successfully' });
    } else {
      res.status(400).json({ message: 'Can not create exam' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam');
});

/**
 * get exam by id
 */
examRouter.get('/:examId', isCourseMember, async (req, res) => {
  const teacherId = req.params.teacherId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;

  try {
    const result = await examService.getExamById(teacherId, courseId, examId);
    if (result.body.found) {
      res.status(200).json({ exam: result.body._source });
    } else {
      res.status(400).json({ message: 'Can not get exam' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * submit examwork
 */
examRouter.post('/:examId', (req, res) => {
  // const teacherId = req.params.userId;
  // const courseId = req.params.courseId;
  // const examId = req.params.examId;
  // const studentId = res.locals.user.id;

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
examRouter.delete('/:examId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;
  try {
    const result = await examService.removeExam(teacherId, courseId, examId);
    if (result.wasApplied()) {
      res.status(200).json({ message: 'Remove exam successfully' });
    } else {
      res.status(400).json({ message: 'Can not remove this exam, please try again' });
    }
  } catch (error) {
    console.error(error);
    req.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId');
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
examRouter.get('/:examId/:studentId', async (req, res) => {
  const teacherId = req.param.userId;
  const courseId = req.params.courseId;
  const examId = req.params.studentId;
  const studentId = req.params.studentId;
  try {
    const result = await examWork.getExamWorkByStudent(teacherId, courseId, examId, studentId);
    if (result.body.found) {
      res.status(200).json({ examWork: result.body._source });
    } else {
      res.status(400).json({ error: 'Can not get this exam work, please try again' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId/:studentId');
});

module.exports = examRouter;
