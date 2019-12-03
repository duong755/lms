import url from 'url';

const baseURL = typeof window !== 'undefined' ? window.location.origin : `http://localhost:${process.env.PORT}`;

/**
 *
 * @param {string} path
 */
const fullURL = (path) => {
  return url.resolve(baseURL, path);
};

export default fullURL;
