const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const numSaltRounds = 8;

async function hashPassword(password) {
  return  bcryptjs.hash(password, numSaltRounds);
}
async function comparePasswordsHashToPlain(plain, hashed) {
  return  bcryptjs.compare(plain, hashed);
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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ").at(1);
  if (token === null) return res.sendStatus(401);
  try {
    req.user = tokenIsValid(token);
    next();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

module.exports.signToken = signToken;
module.exports.authenticateToken = authenticateTokenMiddleware;
module.exports.hashPassword = hashPassword;
module.exports.comparePasswordsHashToPlain = comparePasswordsHashToPlain;
