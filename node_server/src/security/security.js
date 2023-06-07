const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({path:__dirname+'/./../.env'});

const numSaltRounds = 8;

async function hashPassword(password) {
  return bcryptjs.hash(password, numSaltRounds);
}
async function comparePasswordsHashToPlain(plain, hashed) {
  return bcryptjs.compare(plain, hashed);
}
function signToken(userObject, expirationDate) {
  return jwt.sign(userObject, process.env.SECRET_KEY, { expiresIn: "1h" });
}

/**
 * Validates provided JWT token
 * @param {String} jwtToken
 * @return false if failed, else use object
 */
function tokenIsValid(jwtToken) {
  try {
    return jwt.verify(jwtToken, process.env.SECRET_KEY);
  } catch (err) {
    throw new Error(err);
  }
}

function authenticateTokenMiddleware(req, res, next) {
  const authCookie = req.cookies["Authorization"];
  const token = authCookie && authCookie.split(" ").at(1);
  if (token === null) return false;
  try {
    return tokenIsValid(token);
  } catch (err) {
    return false;
  }
}

module.exports.signToken = signToken;
module.exports.authenticateToken = authenticateTokenMiddleware;
module.exports.hashPassword = hashPassword;
module.exports.comparePasswordsHashToPlain = comparePasswordsHashToPlain;
