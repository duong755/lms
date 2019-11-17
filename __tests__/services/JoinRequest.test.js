import { types } from 'cassandra-driver';

import { createJoinRequest, deleteJoinRequest } from '../../server/services/elassandra/JoinRequest';

import { closeConnection } from '../helpers/close';

describe('JoinRequest Services', () => {
  const teacherId = types.Uuid.random();
  const courseId = types.Uuid.random();
  const studentId = types.Uuid.random();

  it('createJoinRequest', async () => {
    const res = await createJoinRequest(teacherId, courseId, studentId, 30);
    expect(res.wasApplied()).toBe(true);
  });

  it('deleteJoinRequest', async () => {
    const res = await deleteJoinRequest(teacherId, courseId, studentId, 30);
    expect(res.wasApplied()).toBe(true);
  }, 30000);
});

afterAll(closeConnection);
