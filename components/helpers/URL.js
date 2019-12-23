import url from 'url';

const urlbackend = process.env.HEROKU ? 'https://openlms.herokuapp.com' : `http://localhost:${process.env.PORT}`;

const baseURL = typeof window !== 'undefined' ? window.location.origin : urlbackend;

/**
 *
 * @param {string} path
 */
const absURL = (path) => {
  return url.resolve(baseURL, path);
};

export default absURL;
