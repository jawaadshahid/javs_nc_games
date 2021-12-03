const { ifCategoryExistsBySlug } = require("../models/categories.model");
const {
  selectReviews,
  selectReviewById,
  incrementReviewVotesById,
} = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  if (category) {
    ifCategoryExistsBySlug(category)
      .then(() => {
        return selectReviews(sort_by, order, category).then((reviews) => {
          res.status(200).send({ reviews });
        });
      })
      .catch(next);
  } else {
    selectReviews(sort_by, order)
      .then((reviews) => {
        res.status(200).send({ reviews });
      })
      .catch(next);
  }
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const inc_votes =
    Object.keys(req.body).length === 1 ? req.body.inc_votes : undefined;
  incrementReviewVotesById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
