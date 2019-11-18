import { createTopic, searchTopic } from '../../server/services/elassandra/Topic';
import { randomName, randomNumber } from '../helpers/random';
import { closeConnection } from '../helpers/close';

describe('Topic Services', () => {
  it('createTopic', async () => {
    const randomTopicsNumber = randomNumber(1, 20);
    const randomTopicNames = '.'
      .repeat(randomTopicsNumber)
      .split('')
      .map(randomName);
    const res = await createTopic(randomTopicNames, 30);
    expect(res.wasApplied()).toBe(true);
  });

  it('searchTopic', async () => {
    const keyword = randomName();
    const res = await searchTopic(keyword, 1);
    expect(res.body.hits).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        hits: expect.any(Array)
      })
    );
  });
});

afterAll(closeConnection);
