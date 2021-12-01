const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);

module.exports = reviewsRouter;
