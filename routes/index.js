const router = require("express").Router();
const user = require("./userRoute");
const article = require("./articleRoute");
const { createUser, loginUser } = require("../controllers/userController");
const NOTFOUND_ERROR = require("../errors/notFoundError");
const {
  userBodyValidator,
  userAuthenticationValidator,
} = require("../middlewares/celebrateValidation");
const limiter = require("../rateLimiter");

//* Making sure the app uses the users and articles routes
router.use("/users", limiter, user);
router.use("/articles", limiter, article);

//* Creates a user in the DB using '/signup' in Postman
router.post("/signup", userBodyValidator, createUser);

//* Signin a user in the DB using '/signin' in Postman
router.post("/signin", userAuthenticationValidator, loginUser);

router.use((req, res, next) => {
  next(new NOTFOUND_ERROR("Route not found"));
});

module.exports = router;
