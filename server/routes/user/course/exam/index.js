const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const isCourseMember = require('../../../../middlewares/isCourseMember');
const canAccessCourse = require('../../../../middlewares/canAccessCourse');
const canAccessExamWork = require('../../../../middlewares/canAccessExamWork');
const examWorkService = require('../../../../services/ExamWork');
const examService = require('../../../../services/Exam');
const { cassandraTypes } = require('../../../../models/connector');

const examRouter = Router({ mergeParams: true });

function getTimeStamp(dateTime) {
  const dateTimeParts = dateTime.split(' ');
  const timeParts = dateTimeParts[1].split(':');
  const dateParts = dateTimeParts[0].split('-');

  const date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
  return date.getTime();
}

function getMark(content, examContent) {
  let point = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i].answer === examContent[i].answer) {
      point += examContent[i].point;
    }
  }
  return point;
}

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

  const newExam = {
    teacherId: teacherId,
    courseId: courseId,
    examId: cassandraTypes.TimeUuid.now(),
    duration: duration,
    content: content,
    startAt: getTimeStamp(startAt),
    title: title
  };
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
examRouter.get('/:examId', canAccessCourse, async (req, res) => {
  const teacherId = req.params.userId;
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
    res.status(500).json({ error: 'Unexpected error occured1' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * submit examwork
 */
examRouter.post('/:examId', isCourseMember, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;
  const studentId = res.locals.user.id;

  const content = req.body.content;

  const schema = Joi.array()
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
    .required();

  const validationResult = schema.validate(content, {
    allowUnknown: true
  });

  if (validationResult.error && validationResult.error.details.length) {
    const error = _.reduce(validationResult.error.details, (result, value) => {
      const key = value.path[0];
      const message = value.message;
      result[key] = message;
      return result;
    });
    res.status(400).json({ error: error });
    return;
  }

  try {
    const thisExam = await examService.getExamById(teacherId, courseId, examId);
    const newExamWork = {
      teacherId: teacherId,
      courseId: courseId,
      examId: examId,
      studentId: studentId,
      content: content,
      submitAt: Date.now(),
      point: getMark(content, thisExam.body._source.content)
    };

    const result = await examWorkService.upsertExamWork(newExamWork, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ message: 'Submit examwork successfully' });
    } else {
      res.status(400).json({ message: 'Can not submit exam work' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * edit exam by id
 */
examRouter.put('/:examId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;

  console.log('dcm admadmasd');

  try {
    let oldExam = await examService.getExamById(teacherId, courseId, examId);
    if (oldExam.body.found) {
      oldExam = oldExam.body._source;

      const newExam = {
        teacherId: teacherId,
        courseId: courseId,
        duration: req.body.duration !== undefined ? req.body.duration : oldExam.duration,
        examId: oldExam.id,
        content: req.body.content !== undefined ? req.body.content : oldExam.content,
        startAt: req.body.startAt !== undefined ? getTimeStamp(req.body.startAt) : oldExam.start_at,
        title: req.body.title !== undefined ? req.body.title : oldExam.title
      };
      const result = await examService.upsertExam(
        newExam,
        ['teacher_id', 'course_id', 'duration', 'id', 'content', 'start_at', 'title'],
        false
      );

      if (result.wasApplied()) {
        res.status(200).json({ message: 'Update exam successfully' });
      } else {
        res.status(400).json({ error: 'Can not update exam' });
      }
    } else {
      res.status(404).json({ error: 'This course does not exist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId');
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
examRouter.get('/:examId/:studentId', canAccessExamWork, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;
  const studentId = req.params.studentId;

  try {
    const result = await examWorkService.getExamWorkByStudent(teacherId, courseId, examId, studentId);
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
