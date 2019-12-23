const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const isCourseMember = require('../../../../middlewares/isCourseMember');
const canAccessExamWork = require('../../../../middlewares/canAccessExamWork');
const canAccessCourse = require('../../../../middlewares/canAccessCourse');
const examWorkService = require('../../../../services/ExamWork');
const examService = require('../../../../services/Exam');
const userService = require('../../../../services/User');
const { cassandraTypes } = require('../../../../models/connector');

const examRouter = Router({ mergeParams: true });

function getMark(content, examContent) {
  let point = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i]['answer'] === examContent[i]['answer']) {
      point += examContent[i].point;
    }
  }
  return point;
}

/**
 * exam pagination
 */
examRouter.get('/', canAccessCourse, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const page = req.query.page || 1;
  try {
    const result = await examService.getExamsByCourse(teacherId, courseId, page);
    const exam = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({
      exams: exam,
      total: result.body.hits.total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
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
    startAt: Number(startAt),
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
      res.status(200).json({ successful: true, examId: newExam.examId });
    } else {
      res.status(400).json({ message: 'Can not create exam' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
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
    let exam = result.body._source;
    if (!(exam.content instanceof Array)) {
      exam.content = [exam.content];
    }
    exam = {
      ...exam,
      content: exam.content.map((current) => {
        return {
          ...current,
          answer: 0
        };
      })
    };
    if (result.body.found) {
      res.status(200).json({ exam: exam });
    } else {
      res.status(400).json({ message: 'Can not get exam' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred1' });
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
  const studentId = req.body.studentId;

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
    console.log(newExamWork);
    const result = await examWorkService.upsertExamWork(newExamWork, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ successful: true });
    } else {
      res.status(400).json({ message: 'Can not submit exam work' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
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
        startAt: req.body.startAt !== undefined ? req.body.startAt : oldExam.start_at,
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
    res.status(500).json({ error: 'Unexpected error occurred' });
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
    req.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId');
});

/**
 * exam summary
 */
examRouter.all('/:examId/summary', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;
  const page = req.query.page;
  try {
    const resExamWork = await examWorkService.getExamWorksByExam(teacherId, courseId, examId, page);
    const userIdArr = resExamWork.body.hits.hits.map((current) => current.username);
    const resExam = await examService.getExamById(teacherId, courseId, examId);
    const titleExam = resExam.body._source.title;
    const summary = resExamWork.body.hits.hits.map((current) => {
      return { ...current, title: titleExam };
    });
    const resUser = await userService.getMultipleUsersById(userIdArr, ['id', 'username']);
    const student = resUser.body.hits.hits.map((current) => current._source);
    for (let i = 0; i < summary.length; i++) {
      const find = student.filter((current) => current.id === summary[i]['student_id']);
      summary[i]['username'] = find.username;
    }
    res.status(500).json({ summary: summary, total: resExamWork.body.total });
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  //res.end('/api/user/:userId/course/:courseId/exam/:examId/summary');
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
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exam/:examId/:studentId');
});

module.exports = examRouter;
