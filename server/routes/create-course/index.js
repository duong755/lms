const { Router } = require('express');

const auth = require('../../middlewares/auth');
const courserService = require('../../services/Course');
const { cassandraTypes } = require('../../models/connector');
const createCourseRouter = Router({ mergeParams: true });

/**
 * create course
 */
createCourseRouter.post('/', auth, async (req, res) => {
  const user = res.locals.user;
  if (user.type === 'teacher') {
    try {
      const newCourse = {
        courseId: cassandraTypes.Uuid.random(),
        teacherId: user.id,
        description: req.body.description,
        topics: [],
        archive: false,
        courseName: req.body.courseName,
        members: []
      };
      const resultUpsert = await courserService.upsertCourse(newCourse, void 0, true);
      if (resultUpsert.wasApplied()) {
        res.status(200).json({
          Success: 'Upsert Course successfully'
        });
      } else {
        res.status(500).json({
          Error: 'Unexpected error occured, please try again'
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
});

module.exports = createCourseRouter;
