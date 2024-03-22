const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const {
  getCurrentUser,
  getUsers,
  updateUser,
} = require("../controllers/userController");
const { validateUpdateUser } = require("../middlewares/celebrateValidation");

//* Gets the current loggedin user
router.get("/me", handleAuthorization, getCurrentUser);

//* Gets a list of the users from the DB using 'users/users' in Postman
router.get("/users", getUsers);

router.patch("/me", handleAuthorization, validateUpdateUser, updateUser);

module.exports = router;
