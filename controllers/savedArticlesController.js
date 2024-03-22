const Article = require("../models/articleSchema");

//* Gets all the created articles
const getArticles = (req, res, next) => {
  Article.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

module.exports = {
  getArticles,
};
