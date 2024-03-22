const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/userSchema");
const UNAUTHORIZED_ERROR = require("../errors/unauthorizedError");
const ConflictError = require("../errors/conflictError");
const InvalidError = require("../errors/invalidError");
const NOTFOUND_ERROR = require("../errors/notFoundError");
const SERVER_ERROR = require("../errors/serverError");
const INVALID_ERROR = require("../errors/invalidError");

//* Gets a list of all the users in the DB
const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: "Error from getItem", err });
    });
};

//* Creates a user into the DB
const createUser = (req, res, next) => {
  // Creating a const of all the attributes needed in the req body
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // If not a valid email, return a new error
      if (!email) {
        return next(new UnauthorizedError("Please enter a valid email"));
      }
      // If there is already a user return a new error
      if (user) {
        return next(new ConflictError("Email already in use"));
      }
      // If req checks out, return the bcrypt and hash the password
      return bcrypt.hash(password, 10);
    })
    // Call the create function to create a user, hashing the password
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userPayload = user.toObject();
      delete userPayload.password;
      res.status(201).send({
        data: userPayload,
      });
    })
    // Catch the errors
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new InvalidError("Validation Error"));
      } else {
        next(err);
      }
    });
};

//* Logs a user in with the correct credentials
const loginUser = (req, res, next) => {
  // Email and password are the the needed params for the req.body
  const { email, password } = req.body;

  // If not a valid email or password, return and error
  if (!email || !password) {
    return res
      .status(INVALID_ERROR)
      .send({ message: "Invalid email or password" });
  }

  // Find a user by credentials
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err);
      next(new UNAUTHORIZED_ERROR("Invalid Credentials"));
    });
};

//* Gets the current loggedin user
const getCurrentUser = (req, res, next) => {
  // Each user res in the DB gets a _id parameter, this is what we need to grab to filter out the users
  const { _id: userId } = req.params;

  User.findById(userId)
    .then((user) => {
      // If not a user, return error
      if (!user) {
        return next(new NOTFOUND_ERROR("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  getUsers,
  loginUser,
};
