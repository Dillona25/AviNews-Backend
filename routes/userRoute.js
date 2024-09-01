const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const {
  getCurrentUser,
  updateUser,
  validateUserEmail,
  validateUserPassword,
} = require("../controllers/userController");
const { validateUpdateUser } = require("../middlewares/celebrateValidation");

//* Gets the current loggedin user
router.get("/me", handleAuthorization, getCurrentUser);

//* Updates a user in the DB
router.patch("/me", handleAuthorization, validateUpdateUser, updateUser);

//* Checks if an email already exists for our signup form
router.post("/check-email", validateUserEmail);

//* Checks if the password matches the email
router.post("/check-password", validateUserPassword);

module.exports = router;
