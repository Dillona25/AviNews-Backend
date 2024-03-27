const Article = require("../models/articleSchema");
const INVALID_ERROR = require("../errors/invalidError");

//* Gets all the created articles
const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new INVALID_ERROR("Invalid ID"));
      }
      if (err.name === "ValidationError") {
        next(new INVALID_ERROR("Invalid ID!"));
      }
      next(err);
    });
};

module.exports = {
  getArticles,
};
