import { types } from 'cassandra-driver';

import {
  getJoinRequestsByCourse,
  getJoinRequestsByStudent,
  getJoinRequestsByTeacher,
  getJoinRequestById,
  createJoinRequest,
  acceptJoinRequest,
  declineJoinRequest
} from '../../server/services/JoinRequest';

import { closeConnection } from '../helpers/close';

const TTL = Number(process.env.TTL) || 30;
describe('JoinRequest Services', () => {
  const randomTeacherId = types.Uuid.random();
  const randomCourseId = types.Uuid.random();
  const randomStudentId = types.Uuid.random();

  it('createJoinRequest', async () => {
    const res = await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('getJoinRequestById', async () => {
    const { body } = await getJoinRequestById(randomTeacherId, randomCourseId, randomStudentId);
    expect(body.found).toBe(true);
  });

  it('getJoinRequestsByCourse', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getJoinRequestsByCourse(randomTeacherId, randomCourseId, randomStudentId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('getJoinRequestsByStudent', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getJoinRequestsByStudent(randomStudentId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('getJoinRequestsByTeacher', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getJoinRequestsByTeacher(randomTeacherId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('acceptJoinRequest', async () => {
    await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    const res = await acceptJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('declineJoinRequest', async () => {
    await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    const res = await declineJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
