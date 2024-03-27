const Article = require("../models/articleSchema");
const INVALID_ERROR = require("../errors/invalidError");
const NOTFOUND_ERROR = require("../errors/notFoundError");
const FORBIDDEN_ERROR = require("../errors/forbiddenError");

//* Creates articles
const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, author, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    author,
    link,
    image,
    owner: req.user._id,
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new INVALID_ERROR("Validation error"));
      } else {
        next(err);
      }
    });
};

//* Deletes Articles
const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const { _id: userId } = req.user;

  Article.findOne({ _id: articleId })
    .then((item) => {
      if (!item) {
        return next(new NOTFOUND_ERROR("Item ID cannot be found"));
      }
      if (!item?.owner?.equals(userId)) {
        return next(new FORBIDDEN_ERROR("You do not own this item"));
      }
      return Article.deleteOne({ _id: articleId, owner: userId }).then(() => {
        res.status(201).send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

module.exports = {
  createArticle,
  deleteArticle,
};
