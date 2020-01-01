import fetch from 'isomorphic-unfetch';

import absURL from './URL';

/**
 *
 * @param {string} input
 */
export const searchTopic = async (input) => {
  try {
    const res = await fetch(absURL(`/api/topic?query=${input}`));
    const json = await res.json();
    return json.topics.map((topic) => ({ value: topic, label: topic }));
  } catch {
    return [];
  }
};
