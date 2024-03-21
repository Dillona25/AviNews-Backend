const router = require("express").Router();
const { getCurrentUser, getUsers } = require("../controllers/userController");

//* Gets the current loggedin user
router.get("/me", getCurrentUser);

//* Gets a list of the users from the DB using 'users/users' in Postman
router.get("/users", getUsers);

module.exports = router;
