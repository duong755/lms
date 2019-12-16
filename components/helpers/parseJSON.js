/**
 *
 * @param {string} str
 * @returns {any}
 */
export default function parseJSON(str, fallback = null) {
  let json = null;
  try {
    json = JSON.parse(str);
  } catch {
    json = fallback;
  }
  return json;
}
