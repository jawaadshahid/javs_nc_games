const {
  selectReviews,
  selectReviewById,
  incrementReviewVotesById,
} = require("../models/reviews.model");

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  if (isNaN(review_id)) {
    next({
      status: 400,
      msg: "Bad request: Invalid Review ID",
    });
  } else {
    selectReviewById(review_id)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch(next);
  }
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  if (isNaN(review_id)) {
    next({
      status: 400,
      msg: "Bad request: Invalid Review ID",
    });
  } else {
    const { inc_votes } = req.body;
    if (!isNaN(inc_votes) && Object.keys(req.body).length === 1) {
      incrementReviewVotesById(review_id, inc_votes)
        .then((review) => {
          res.status(200).send({ review });
        })
        .catch(next);
    } else {
      next({
        status: 422,
        msg: "Unprocessable Entity: Invalid request",
      });
    }
  }
};
