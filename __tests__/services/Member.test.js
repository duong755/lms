import { types } from 'cassandra-driver';

import { closeConnection } from '../helpers/close';
import { Member, mapper } from '../../server/models';
import { getMembersByCourse, removeMemberFromCourse } from '../../server/services/Member';

const randomTeacherId = types.Uuid.random();
const randomCourseId = types.Uuid.random();
const random1stMember = types.Uuid.random();
const random2ndMember = types.Uuid.random();

beforeAll(() => {
  mapper
    .batch([
      Member.batching.insert({ teacher_id: randomTeacherId, course_id: randomCourseId, student_id: random1stMember }),
      Member.batching.insert({ teacher_id: randomTeacherId, course_id: randomCourseId, student_id: random2ndMember })
    ])
    .then(() => {})
    .catch(console.error);
});

describe('Member Service', () => {
  it('getMembersByCourse', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getMembersByCourse(randomTeacherId, randomCourseId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(2);
        done();
      }, 1000);
    });
  });

  it('removeMemberFromCourse', async () => {
    const res = await removeMemberFromCourse(randomTeacherId, randomCourseId, random1stMember);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(async (done) => {
  await mapper.batch([
    Member.batching.remove({ teacher_id: randomTeacherId, course_id: randomCourseId, student_id: random1stMember }),
    Member.batching.remove({ teacher_id: randomTeacherId, course_id: randomCourseId, student_id: random2ndMember })
  ]);
  await closeConnection(done);
});
