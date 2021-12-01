const { selectReviews, selectReviewById } = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id).then((review) => {
    res.status(200).send({ review });
  });
};
