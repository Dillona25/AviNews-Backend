const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/userController");
const { validateUpdateUser } = require("../middlewares/celebrateValidation");

//* Gets the current loggedin user
router.get("/me", handleAuthorization, getCurrentUser);

//* Updates a user in the DB
router.patch("/me", handleAuthorization, validateUpdateUser, updateUser);

module.exports = router;
