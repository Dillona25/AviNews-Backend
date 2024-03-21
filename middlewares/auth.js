const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

// Creating an authError
const authError = (next) => next(new UnauthorizedError("Authorization error"));

// Extract the token from an Authorization header that uses the Bearer token scheme.
const extractBearerToken = (header) => header.replace("Bearer ", "");

//  Authenticating token to use for requests that require an authenticated user
const handleAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return authError(next);
  }

  req.user = payload;

  return next();
};

module.exports = { handleAuthorization };
