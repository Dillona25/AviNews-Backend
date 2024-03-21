const router = require("express").Router();
const user = require("./userRoute");
const { createUser, loginUser } = require("../controllers/userController");
const { NOTFOUND_ERROR } = require("../errors/notFoundError");

//* Making sure the app uses the users routes
router.use("/users", user);

//* Creates a user in the DB using '/signup' in Postman
router.post("/signup", createUser);

//* Signin a user in the DB using '/signin' in Postman
router.post("/signin", loginUser);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR).send({ message: "Route not found" });
});

module.exports = router;
