import { types } from 'cassandra-driver';

import { randomName } from '../helpers/random';
import { closeConnection } from '../helpers/close';

import {
  upsertCourse,
  getCourseById,
  getCoursesByStudent,
  getCoursesByTeacher,
  searchCourses
} from '../../server/services/Course';

const TTL = Number(process.env.TTL) || 30;

const randomTeacherId = types.Uuid.random();
const randomCourseId = types.Uuid.random();
const randomStudentId = types.Uuid.random();
const randomCourseName = randomName();
const randomCourseDescription = randomName();
const randomCourseTopics = [randomName(), randomName(), randomName()];

const randomNewCourseName = randomName();
const randomNewCourseDescription = randomName();
const randomNewCourseTopics = [randomName(), randomName()];

describe('Course Services', () => {
  it('upsertCourse (insert)', async () => {
    const res = await upsertCourse(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        courseName: randomCourseName,
        members: [randomStudentId],
        archive: false,
        description: randomCourseDescription,
        topics: randomCourseTopics
      },
      void 0,
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getCourseById', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getCourseById(randomTeacherId, randomCourseId);
        expect(body.found).toBe(true);
        done();
      }, 1000);
    });
  });

  it('getCoursesByTeacher', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getCoursesByTeacher(randomTeacherId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('getCoursesByStudent', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getCoursesByStudent(randomStudentId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('searchCourses', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await searchCourses(randomName(), randomCourseTopics, void 0, void 0, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(0);
        done();
      }, 1000);
    });
  });

  it('upsertCourse (update)', async () => {
    const res = await upsertCourse(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        courseName: randomNewCourseName,
        archive: true,
        description: randomNewCourseDescription,
        topics: randomNewCourseTopics
      },
      ['teacher_id', 'id', 'course_name', 'archive', 'description', 'topics'],
      false,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
