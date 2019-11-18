import { types } from 'cassandra-driver';

import { createJoinRequest, acceptJoinRequest, declineJoinRequest } from '../../server/services/elassandra/JoinRequest';

import { closeConnection } from '../helpers/close';

describe('JoinRequest Services', () => {
  const teacherId = types.Uuid.random();
  const courseId = types.Uuid.random();
  const studentId = types.Uuid.random();

  it('createJoinRequest', async () => {
    const res = await createJoinRequest(teacherId, courseId, studentId, 30);
    expect(res.wasApplied()).toBe(true);
  });

  it('acceptJoinRequest', async () => {
    await createJoinRequest(teacherId, courseId, studentId, 30);
    const res = await acceptJoinRequest(teacherId, courseId, studentId, 30);
    expect(res.wasApplied()).toBe(true);
  });

  it('declineJoinRequest', async () => {
    await createJoinRequest(teacherId, courseId, studentId, 30);
    const res = await declineJoinRequest(teacherId, courseId, studentId, 30);
    expect(res.wasApplied()).toBe(true);
  }, 30000);
});

afterAll(closeConnection);
