const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const {
  saveArticle,
  deleteArticle,
  getSavedArticles,
} = require("../controllers/articleController");
const { getArticles } = require("../controllers/savedArticlesController");
const {
  createArticleValidation,
  idValidation,
} = require("../middlewares/celebrateValidation");

//* Rpute to get saved articles
router.get("/", handleAuthorization, getSavedArticles);

//* Route to create articles
router.post("/", handleAuthorization, createArticleValidation, saveArticle);

//* Route to delete articles
router.delete("/:articleId", handleAuthorization, idValidation, deleteArticle);

//* Route to get all of the created or saved articles
router.get("/", handleAuthorization, getArticles);

module.exports = router;
