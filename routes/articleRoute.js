const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const {
  createArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { getArticles } = require("../controllers/savedArticlesController");

//* Route to create articles
router.post("/", handleAuthorization, createArticle);

//* Route to delete articles
router.delete("/:articleId", handleAuthorization, deleteArticle);

//* Route to get all of the created or saved articles
router.get("/", getArticles);

module.exports = router;
