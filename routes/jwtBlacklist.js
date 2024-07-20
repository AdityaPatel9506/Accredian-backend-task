// jwtBlacklist.js
const jwtBlacklist = new Set();

function addToken(token) {
  jwtBlacklist.add(token);
}

function hasToken(token) {
  return jwtBlacklist.has(token);
}

module.exports = {
  addToken,
  hasToken,
};
