const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/userSchema");
const UNAUTHORIZED_ERROR = require("../errors/notAuthorizedError");
const ConflictError = require("../errors/conflictError");
const InvalidError = require("../errors/invalidError");
const NOTFOUND_ERROR = require("../errors/notFoundError");
const INVALID_ERROR = require("../errors/invalidError");

//* Creates a user into the DB
const createUser = (req, res, next) => {
  // Creating a const of all the attributes needed in the req body
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      // If not a valid email, return a new error
      if (!email) {
        return next(new UNAUTHORIZED_ERROR("Please enter a valid email"));
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
    res.status(INVALID_ERROR).send({ message: "Invalid email or password" });
    return;
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
  const { _id: userId } = req.user;

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

//* Updates a user
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NOTFOUND_ERROR("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new InvalidError("Validation Error"));
      } else {
        next(err);
      }
    });
};

//* Checks to see if a user exists with the current email

const validateUserEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* Checks if the password matches the email

const validateUserPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Compare provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res.json({ valid: true });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error("Error checking email or password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  loginUser,
  updateUser,
  validateUserEmail,
  validateUserPassword,
};
