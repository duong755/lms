const numbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
const lowerLetter = [
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  89,
  90
];
const upperLetter = [
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
  106,
  107,
  108,
  109,
  110,
  111,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  120,
  121,
  122
];
const allowCharacters = String.fromCharCode(
  45, // hyphen
  ...numbers,
  ...upperLetter,
  95, // underscore,
  ...lowerLetter
);

/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomNumber(min, max) {
  min = Math.abs(Math.floor(min));
  max = Math.abs(Math.floor(max));
  if (max < min) {
    [min, max] = [max, min];
  }
  return Math.floor(min + (max - min + 1) * Math.random());
}

/**
 *
 * @returns {string}
 */
export function randomName() {
  const nameLength = randomNumber(2, 32);

  let name = '';
  let nextCharacter = '';

  for (let i = 0; i < nameLength; i++) {
    nextCharacter = allowCharacters[randomNumber(0, allowCharacters.length - 1)];
    name += nextCharacter;
  }
  return name;
}
